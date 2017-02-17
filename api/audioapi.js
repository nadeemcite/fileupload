var multer  = require('multer');
var mv =require('mv');
var fs =require('fs');
var fse = require('fs-extra')
var Audio=require('../models/audio');
var upload = multer({ dest: 'audio/' });

var uploads = require('formidable-upload');

 var uploader = uploads()
      .accept(['audio/mp3', 'audio/wav']);

module.exports=function(app){
    
    app.get('/audio_single/:id',function(req,res){
        Audio.findOne({'_id':req.params.id},function(err,audio){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                res.send({
                    status:true,
                    audio: audio
                });
            }
        })
    });
    
    app.get('/audios',function(req,res){
        Audio.find({"active" : true } ,function(err,audios){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                res.send({
                    status:true,
                    audios:audios
                });
            }
        })
    });
    
    
    app.get('/audio/song/:id',function(req,res){
        Audio.findOne({'_id':req.params.id , "active": true},function(err,audio){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                if(audio!=null){
                    if(audio.ext)
                        res.sendFile('/home/ubuntu/workspace/repository_audio/'+req.params.id+audio.ext);
                    else
                        res.send(404);
                }else{
                    res.send(404);
                }
            }
        })
        
    });
    
    app.post('/audio',upload.uploader(),function(req,res){
        if(req.files && req.files.length>0){
            var fileObj=req.files[0];
            var ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
            var audioObj={name:req.body.name,ext:ext}; // Since we are not getting data as object
            audioObj.active = true ;
            Audio.create(audioObj,function(err,audio){
                if(err){
                    res.send({
                        status:false,
                        error:err
                    })
                }else{
                    var newFileName=audio._id+ext;
                    
             
                    mv(fileObj.path,'repository_audio/'+newFileName,function(err){
                        if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                        }else{
                            res.send(audio);
                        }
                    });
                    
                }
            });
        }else{
            res.send({
                status:false,
                error:'No File Found'
            });
        }
    });
    
    app.put('/audio/:id',upload.uploader(),function(req,res){
        var updateObj={
            name:req.body.name
        };
        if(req.files && req.files.length>0){
            var fileObj=req.files[0];
            updateObj.ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
        }
        
        Audio.findOneAndUpdate({'_id':req.params.id},{$set:updateObj},function(err,audio){
            if(err){
               res.send({
                    status:false,
                    error:err
                });
            }else{
                
                if(req.files && req.files.length>0){
                    //should run only if file was uploaded
                    var fileObj=req.files[0];
                    var ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
                    var newFileName=req.params.id+ext;
                    
                    mv(fileObj.path,'repository_audio/'+newFileName,function(err){
                        if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                        }else{
                            res.send({
                                status:true,
                                audio:audio
                            });
                        }
                    });
                }else{
                    //if no file uploaded send object normally
                    res.send({
                        status:true,
                        audio:audio
                    })
                }
            }
        });
       
    });
    
    
    app.delete('/audio/:id',function(req,res){
        Audio.findOneAndUpdate({'_id':req.params.id}, {$set : {"active" : false}}, function(err,audio){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }
            else {
                         
                    console.log("File deleted successfully!");
                    res.send({
                            status: true,
                            audio: audio });
                         
                  }
       });
        
    }); 
    
} 