var multer  = require('multer');
var mv =require('mv');
var fs =require('fs');
var fse = require('fs-extra')
var Gallery=require('../models/gallery');
var upload = multer({ dest: 'repository/' });
module.exports=function(app){
    
    app.get('/api/gallery_single/:id',function(req,res){
        Gallery.findOne({'_id':req.params.id},function(err,gallery){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                res.send({
                    status:true,
                    gallery:gallery
                });
            }
        })
    });
    
    app.get('/api/gallery',function(req,res){
        Gallery.find({"active" : true } ,function(err,galleries){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                res.send({
                    status:true,
                    galleries:galleries
                });
            }
        })
    });
    
    //api to get gallery image
    app.get('/api/gallery/image/:id',function(req,res){
        Gallery.findOne({'_id':req.params.id , "active": true},function(err,gallery){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                if(gallery!=null){
                    if(gallery.ext)
                        res.sendFile('/home/ubuntu/workspace/public_repository/'+req.params.id+gallery.ext);
                    else
                        res.send(404);
                }else{
                    res.send(404);
                }
            }
        })
        
    });
    
    app.post('/api/gallery',upload.any(),function(req,res){
        if(req.files && req.files.length>0){
            var fileObj=req.files[0];
            var ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
            var galleryObj={name:req.body.name,ext:ext}; // Since we are not getting data as object
            galleryObj.active = true ;
            Gallery.create(galleryObj,function(err,gallery){
                if(err){
                    res.send({
                        status:false,
                        error:err
                    })
                }else{
                    var newFileName=gallery._id+ext;
                    
                    // required because through multer files are uploaded in repository folder 
                    // this function will upload all files in public_repository in format <id>.<extention>
                    mv(fileObj.path,'public_repository/'+newFileName,function(err){
                        if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                        }else{
                            res.send(gallery);
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
    
    app.put('/api/gallery/:id',upload.any(),function(req,res){
        var updateObj={
            name:req.body.name
        };
        if(req.files && req.files.length>0){
            var fileObj=req.files[0];
            updateObj.ext=fileObj.originalname.substr(fileObj.originalname.lastIndexOf("."));
        }
        
        Gallery.findOneAndUpdate({'_id':req.params.id},{$set:updateObj},function(err,gallery){
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
                    
                    // required because through multer files are uploaded in repository folder 
                    // this function will upload all files in public_repository in format <id>.<extention>
                    mv(fileObj.path,'public_repository/'+newFileName,function(err){
                        if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                        }else{
                            res.send({
                                status:true,
                                gallery:gallery
                            });
                        }
                    });
                }else{
                    //if no file uploaded send object normally
                    res.send({
                        status:true,
                        gallery:gallery
                    })
                }
            }
        });
       
    });
    
    
    app.delete('/api/gallery/:id',function(req,res){
        Gallery.findOneAndUpdate({'_id':req.params.id}, {$set : {"active" : false}}, function(err,gallery){
            if(err){
                res.send({
                    status:false,
                    error:err
                })
            }else{
                    
             /*   fs.unlink('/public_repository/'+req.params.id, function(err) {
                     if(err){
                            res.send({
                                status:false,
                                error:err
                            });
                     }
                    else{
                            console.log("File deleted successfully!");
                             res.send({
                                     status:true,
                                    gallery:gallery });
                         }
                 }); */
                 
                 
                 fse.remove('/public_repository/'+req.params.id+gallery.ext, function (err) {
                          if(err){
                                 res.send({
                                     status:false,
                                     error:err
                                 });
                          }
                     
                         else{
                         
                                 console.log("File deleted successfully!");
                                 res.send({
                                     status: true,
                                     gallery: gallery });
                         
                             }
 
                 });
                 
                }
       });
        
    }); 
    
}