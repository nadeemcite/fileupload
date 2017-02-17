var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var mongoose = require('mongoose');
var config = require('./config');


var PORT=8080;
mongoose.connect(config.data); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 


var routes = require('./api/galleryapi')(app);
require('./api/eventapi')(app);
var routes = require('./api/audioapi')(app);
var routes = require('./api/videoapi')(app);


app.use(express.static(__dirname + '/public'));


app.listen(PORT,function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Server started');
    }
})