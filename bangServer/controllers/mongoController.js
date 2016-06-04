/**
 * Created by tedshaffer on 6/4/16.
 */
var path = require('path');
var mongoose = require('mongoose');
require('datejs');

var dbOpened = false;

var Schema = mongoose.Schema;
var thumbSchema = new Schema({
    mediaFilePath: String,
    url: String,
    mediaFolder: String,
    lastModified: Date
});
var Thumb = mongoose.model('Thumb', thumbSchema);

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


function saveThumbsToDB(thumbs) {

    return new Promise(function (resolve, reject) {

        var thumbSpecs = [];
        var thumbsSaved = 0;

        thumbs.forEach(function(thumb) {

            var thumbSpec = { 
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
    saveThumbsToDB: saveThumbsToDB
}
