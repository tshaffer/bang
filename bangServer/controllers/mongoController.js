/**
 * Created by tedshaffer on 6/4/16.
 */
var dbOpened = false;

var mongoose = require('mongoose');
require('datejs');

var Schema = mongoose.Schema;
var thumbSchema = new Schema({
    mediaFilePath: String,
    url: String,
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

        thumbs.forEach(function(thumb) {

            var thumbForDB = new Thumb({
                mediaFilePath: thumb.filePath,
                url: thumb.thumbUrl,
                lastModified: thumb.lastModified
            });

            thumbForDB.save(function (err) {
                if (err) return handleError(err);
            });
        });

        console.log("all thumbs submitted to save engine");

        resolve();
    })
}


module.exports = {
    initialize: initialize,
    saveThumbsToDB: saveThumbsToDB
}
