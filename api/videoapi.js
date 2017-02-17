var multer  = require('multer');
var mv =require('mv');
var fs =require('fs');
var fse = require('fs-extra')
var Video=require('../models/video');
var upload = multer({ dest: 'video/' });

/*var uploads = require('formidable-upload');

 var uploader = uploads()
      .accept(['video/mp4', 'video/avi']); */

module.exports=function(app){
    
    app.get('/video_single/:id',function(req,res){
        Video.findOne({'_id':req.params.id},function(err,video){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                res.send({
                    status:true,
                    video: video
                });
            }
        })
    });
    
    app.get('/videos',function(req,res){
        Video.find({"active" : true } ,function(err,videos){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                res.send({
                    status:true,
                    videos:videos
                });
            }
        })
    });
    
    
    app.get('/video/:id',function(req,res){
        Video.findOne({'_id':req.params.id , "active": true},function(err,video){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                if(video!=null){
                    if(video.ext)
                        res.sendFile('/home/ubuntu/workspace/repository_video/'+req.params.id+video.ext);
                    else
                        res.send(404);
                }else{
                    res.send(404);
                }
            }
        })
        
    });
    
    app.post('/video',upload.any(),function(req,res){
        if(req.files && req.files.length>0){
            var fileObj=req.files[0];
            var ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
            var videoObj={name:req.body.name,ext:ext}; // Since we are not getting data as object
            videoObj.active = true ;
            Video.create(videoObj,function(err,video){
                if(err){
                    res.send({
                        status:false,
                        error:err
                    })
                }else{
                    var newFileName=video._id+ext;
                    
             
                    mv(fileObj.path,'repository_video/'+newFileName,function(err){
                        if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                        }else{
                            res.send(video);
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
    
    app.put('/video/:id',upload.any(),function(req,res){
        var updateObj={
            name:req.body.name
        };
        if(req.files && req.files.length>0){
            var fileObj=req.files[0];
            updateObj.ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
        }
        
        Video.findOneAndUpdate({'_id':req.params.id},{$set:updateObj},function(err,video){
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
                    
                    mv(fileObj.path,'repository_video/'+newFileName,function(err){
                        if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                        }else{
                            res.send({
                                status:true,
                                video:video
                            });
                        }
                    });
                }else{
                    //if no file uploaded send object normally
                    res.send({
                        status:true,
                        video:video
                    })
                }
            }
        });
       
    });
    
    
    app.delete('/video/:id',function(req,res){
        Video.findOneAndUpdate({'_id':req.params.id}, {$set : {"active" : false}}, function(err,video){
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
                            video: video });
                         
                  }
       });
        
    }); 
    
} 