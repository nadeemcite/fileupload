var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Event', new Schema({
    name          : String,
    description   : String,
    ondate        : Date,
    location      : String,
    notification  : Date,
    updatedOn     : Date,
    createdOn     : Date,
    active        : Boolean
}));
