/**
 * Created by tedshaffer on 6/4/16.
 */
var dbOpened = false;

var mongoose = require('mongoose');
require('datejs');

var Schema = mongoose.Schema;
var thumbSchema = new Schema({
    path: String,
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

module.exports = {
    initialize: initialize
}
