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

var bsnPresentationSchema = new Schema({
    name: String,
    sign: String
});
var BSNPresentation = mongoose.model('BSNPresentation', bsnPresentationSchema);

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

function saveBSNPresentation(name, sign) {

    return new Promise(function (resolve, reject) {
        if (dbOpened) {

            var bsnPresentationSpec = {
                name: name,
                sign: sign
            };
            var bsnPresentationForDB = new BSNPresentation(bsnPresentationSpec);

            bsnPresentationForDB.save(function(err) {
                if (err) {
                   throw err;
                }
                console.log("BSNPresentation saved to db");
            });
        }
    })
}


function getBSNPresentations() {
    
    return new Promise(function (resolve, reject) {
        if (dbOpened) {
            BSNPresentation.find({ }, function (err, bsnPresentationDocs) {
                if (err) {
                    console.log("BSNPresentation.find returned error");
                    reject();
                }
                if (bsnPresentationDocs.length == 0) {
                    console.log("BSNPresentation.find returned none");
                    reject();
                }
                else {
                    
                    var bsnPresentationNames = [];
                    
                    bsnPresentationDocs.forEach(function(bsnPresentationDoc) {
                        bsnPresentationNames.push(bsnPresentationDoc.name);
                    });
                    
                    resolve(bsnPresentationNames);
                }
            });
        }
    })
}


function getBSNPresentation(name) {

    return new Promise(function (resolve, reject) {
        if (dbOpened) {

            BSNPresentation.find({ name: name }, function (err, bsnPresentationDocs) {
                if (err) {
                    console.log("BSNPresentation.find returned error");
                    reject();
                }
                if (bsnPresentationDocs.length == 0) {
                    console.log("BSNPresentation.find returned none");
                    reject();
                }
                if (bsnPresentationDocs.length > 1) {
                    console.log("BSNPresentation.find more than one");
                    reject();
                }
                
                resolve(bsnPresentationDocs[0].sign);
            });
        }
    })
}


function getMediaFolder() {
    return new Promise(function (resolve, reject) {
        if (dbOpened) {
            MediaFolder.find({ }, function (err, mediaFolderDoc) {
                if (err) {
                    console.log("MediaFolder.find returned error");
                    reject();
                }
                if (mediaFolderDoc.length == 0) {
                    console.log("MediaFolder.find returned none");
                    reject();
                }
                else {
                    resolve(mediaFolderDoc[0].folder);
                }
            });
        }
        else {
            reject();
        }
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


function findThumbsCallback(thumbDocs, mediaFolder) {

    var thumbs = [];

    thumbDocs.forEach(function (thumbDoc) {

        var thumbDocObj =
        {
            id: thumbDoc.id,
            fileName: thumbDoc.fileName,
            thumbFileName: thumbDoc.thumbFileName,
            mediaFilePath: thumbDoc.mediaFilePath,
            url: thumbDoc.url,
            lastModified: thumbDoc.lastModified
        };

        if (mediaFolder) {
            thumbDocObj.mediaFolder = mediaFolder;
        }

        thumbs.push(thumbDocObj);
    });

    return thumbs;
}


function getAllThumbs() {

    return new Promise(function (resolve, reject) {

        if (dbOpened) {
            Thumb.find({}, function(err, thumbDocs) {
                if (err) {
                    reject();
                }
                var thumbs = findThumbsCallback(thumbDocs, null);
                resolve(thumbs);
            });
        }
        else {
            reject();
        }
    });
}


function findThumbs(mediaFolder) {

    return new Promise(function (resolve, reject) {

        if (dbOpened) {
            Thumb.find({mediaFolder: mediaFolder}, function(err, thumbDocs) {
                if (err) {
                    reject();
                }
                var thumbs = findThumbsCallback(thumbDocs, null);
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
    getMediaFolder: getMediaFolder,
    updateMediaFolder: updateMediaFolder,
    getAllThumbs: getAllThumbs,
    findThumbs: findThumbs,
    saveThumbsToDB: saveThumbsToDB,
    saveBSNPresentation: saveBSNPresentation,
    getBSNPresentations: getBSNPresentations,
    getBSNPresentation: getBSNPresentation
}
