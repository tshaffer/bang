/**
 * Created by tedshaffer on 6/3/16.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");
var easyImage = require("easyimage");

var dbController = require('./controllers/mongoController');
var exifReader = require('./controllers/nodeExif.js');






var openDBPromise = dbController.initialize();
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, '../bangClient/')));


openDBPromise.then(function() {
});


var mediaFileSuffixes = ['jpg'];

app.get('/getThumbs', function(req, res) {

    console.log("getThumbs invoked");
    res.set('Access-Control-Allow-Origin', '*');

    var folder = req.query.mediaFolder;

    var mediaFilesInFolder = [];
    mediaFilesInFolder = findMediaFiles(folder, mediaFilesInFolder);

    if (mediaFilesInFolder.length > 0) {

        var mediaFilesToAdd = [];
        mediaFilesInFolder.forEach(function (mediaFileInFolder) {
            mediaFilesToAdd.push(mediaFileInFolder);
        });

        if (mediaFilesToAdd.length > 0) {
            var getExifDataPromise = exifReader.getAllExifData(mediaFilesToAdd);
            getExifDataPromise.then(function(mediaFiles) {
                console.log("getExifDataPromised resolved");
                var buildThumbnailsPromise = buildThumbnails(mediaFiles);
                buildThumbnailsPromise.then(function(obj) {
                    console.log("thumbnails build complete");
                    // TODO - what's in mediaFiles - can't access it from debugger.
                    var saveThumbsPromise = dbController.saveThumbsToDB(mediaFilesToAdd);
                    saveThumbsPromise.then(function(thumbSpecs) {
                        var response = {};
                        response.thumbs = thumbSpecs;
                        res.send(response);
                    });
                });
            });
        }
    }
});


function findMediaFiles(dir, mediaFiles) {
    var files = fs.readdirSync(dir);
    mediaFiles = mediaFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            mediaFiles = findMediaFiles(dir + '/' + file, mediaFiles);
        }
        else {
            // add it if it's a media file but not if it's a thumbnail
            mediaFileSuffixes.forEach(function(suffix) {
                if (file.toLowerCase().endsWith(suffix)) {
                    var thumbSuffix = "_thumb." + suffix;
                    if (!file.toLowerCase().endsWith(thumbSuffix)) {
                        var mediaFile = {};

                        // TODO - url needs to include dir to distinguish thumbs with the same file name
                        mediaFile.filePath = path.join(dir, file);
                        // mediaFile.url = path.join(__dirname, 'thumbs', file + "_thumb." + suffix);
                        mediaFile.lastModified = new Date();
                        mediaFiles.push(mediaFile);
                    }
                }
            });
        }
    });
    return mediaFiles;
};


// build thumbs for the media library
function buildThumbnails(mediaFiles) {

    var fileCount = mediaFiles.length;

    return new Promise(function(resolve, reject) {

        var sequence = Promise.resolve();

        mediaFiles.forEach(function(mediaFile) {
            // Add these actions to the end of the sequence
            sequence = sequence.then(function() {
                return buildThumb(mediaFile);
            }).then(function(imageFile) {
                fileCount--;
                console.log("fileCount=" + fileCount);
                if (fileCount == 0) {
                    resolve(null);
                }
            });
        });
    });
}


function buildThumb(mediaFile) {

    return new Promise(function(resolve, reject) {

        var targetHeight = 100;
        var targetWidth = mediaFile.imageWidth / (mediaFile.imageHeight / targetHeight);

        var dirName = path.dirname(mediaFile.filePath);
        var fileName = path.basename(mediaFile.filePath);
        var ext = path.extname(mediaFile.filePath);

        var thumbFileName = fileName.substring(0,fileName.length - ext.length) + "_thumb" + ext;
        var thumbPathName = path.join(dirName,thumbFileName);

        // TODO - thumbUrl needs to include dir to distinguish thumbs with the same file name
        mediaFile.thumbUrl = path.join(__dirname, 'thumbs', thumbFileName);

        var createThumbPromise = easyImage.resize({
            src: mediaFile.filePath,
            dst: thumbPathName,
            width: targetWidth,
            height: targetHeight,
            quality: 75
        });
        createThumbPromise.then(function (thumbImage) {
            // thumbImage is the object returned from easyimage - it's not used
            console.log("created thumbnail " + thumbImage.name);
            resolve(thumbImage);
        });
    });
}


function handleError(err) {
    console.log("handleError invoked");
    return;
}

console.log("bangServer listening on port 6969");

var port = process.env.PORT || 6969;
app.listen(port);
