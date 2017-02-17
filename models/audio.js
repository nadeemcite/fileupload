var mongoose = require('mongoose');

var AudioSchema = mongoose.Schema({ 
    name:String,
    ext:String,
    active : Boolean
});
module.exports = mongoose.model('Audio', AudioSchema);