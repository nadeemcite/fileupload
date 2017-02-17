var mongoose = require('mongoose');

var VideoSchema = mongoose.Schema({ 
    name:String,
    ext:String,
    active : Boolean
});
module.exports = mongoose.model('Video', VideoSchema);