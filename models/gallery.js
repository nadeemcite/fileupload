var mongoose = require('mongoose');

//very good neetu atleast you have understanding on how we should actually delete things from db
var GallerySchema = mongoose.Schema({ 
    name:String,
    ext:String,
    active : Boolean
});
module.exports = mongoose.model('Gallery', GallerySchema);
