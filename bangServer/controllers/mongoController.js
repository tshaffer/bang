/**
 * Created by tedshaffer on 6/4/16.
 */
var path = require('path');
var mongoose = require('mongoose');
require('datejs');

var dbOpened = false;

var Schema = mongoose.Schema;

var thumbSchema = new Schema({
    fileName: String,
    thumbFileName: String,
    mediaFilePath: String,
    url: String,
    mediaFolder: String,
    lastModified: Date
});
var Thumb = mongoose.model('Thumb', thumbSchema);

var mediaFolderSchema = new Schema({
    folder: String
});
var MediaFolder = mongoose.model('MediaFolder', mediaFolderSchema);

function initialize() {

    return new Promise(function (resolve, reject) {

        mongoose.connect('mongodb://localhost/bang');

        var db = mongoose.connection;
        // db.on('error', console.error.bind(console, 'connection error:'));
        db.on('error', function() {
            reject();
        })
        db.once('open', function() {
            console.log("connected to bang");
            dbOpened = true;
            resolve();
        });
    });
}


function updateMediaFolder(mediaFolder) {
    return new Promise(function (resolve, reject) {
        if (dbOpened) {

            MediaFolder.find({ }, function (err, mediaFolderDocs) {
                if (err) {
                    console.log("MediaFolder.find returned error");
                    reject();
                }
                if (mediaFolderDocs.length == 0) {

                    // none exists; add it
                    var mediaFolderSpec = {
                        folder: mediaFolder
                    };
                    var mediaFolderForDB = new MediaFolder(mediaFolderSpec);

                    mediaFolderForDB.save(function (err) {
                        if (err) {
                            console.log("error adding mediaFolder");
                            reject();
                        }
                    })
                }
                else {
                    var mediaFolderDoc = mediaFolderDocs[0];
                    MediaFolder.findByIdAndUpdate(mediaFolderDoc.id, { $set: { folder: mediaFolder}}, function(err, mediaFolder) {
                        if (err) {
                            console.log("MediaFolder.findByIdAndUpdate returned error");
                            reject();
                        }
                    });
                }
            });

            resolve();
            console.log("mediaFolderUpdated");
        }
        else {
            reject();
        }
    });
}


function findThumbs(mediaFolder) {

    return new Promise(function (resolve, reject) {

        var thumbs = [];
        
        if (dbOpened) {

            Thumb.find({ mediaFolder: mediaFolder }, function (err, thumbDocs) {
                if (err) {
                    console.log("error returned from mongoose query");
                    reject();
                }

                thumbDocs.forEach(function (thumbDoc) {
                    thumbs.push(
                        {
                            id: thumbDoc.id,
                            fileName: thumbDoc.fileName,
                            thumbFileName: thumbDoc.thumbFileName,
                            mediaFilePath: thumbDoc.mediaFilePath,
                            mediaFolder: mediaFolder,
                            url: thumbDoc.url,
                            lastModified: thumbDoc.lastModified});
                        });

                resolve(thumbs);
            });

        }
        else {
            reject();
        }
    });
}


function saveThumbsToDB(thumbs) {

    return new Promise(function (resolve, reject) {

        var thumbSpecs = [];
        var thumbsSaved = 0;

        thumbs.forEach(function(thumb) {

            var thumbSpec = {
                fileName: thumb.fileName,
                thumbFileName: thumb.thumbFileName,
                mediaFilePath: thumb.filePath,
                mediaFolder: path.dirname(thumb.filePath),
                url: thumb.thumbUrl,
                lastModified: thumb.lastModified
            };
            
            var thumbForDB = new Thumb(thumbSpec);

            thumbForDB.save(function (err) {
                if (err) return handleError(err);
                thumbsSaved++;
                if (thumbsSaved == thumbs.length) {
                    resolve(thumbSpecs);
                    console.log("all thumbs saved to db");
                }
            });
            
            thumbSpecs.push(thumbSpec);
        });

        console.log("all thumbs submitted to save engine");
    })
}


module.exports = {
    initialize: initialize,
    updateMediaFolder: updateMediaFolder,
    findThumbs: findThumbs,
    saveThumbsToDB: saveThumbsToDB
}
