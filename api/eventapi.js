var Event = require('../models/event');
var moment = require('moment');
module.exports = function (app) {
    
      app.post('/event', function (req, res) {
        var event = req.body.event;
        event.createdOn = new Date();
        event.updatedOn = new Date();
           event.active = true;
      //  event.ondate = new Date(moment(event.ondate, 'DD-MM-YYYY HH:mm'));
     //   event.ondate = new Date(moment(event.date +" "+ event.time,'DD-MM-YYYY HH:mm'));
       //  delete event.date;
         //delete event.time;
          
        //  event.notification = new Date(moment(event.notidate +" "+ event.notitime,'DD-MM-YYYY HH:mm'));
         //   delete event.notidate;
         //   delete event.notitime;
        
        Event.create(event, function (err, new_event) {
            
            if (err) {
                res.json({
                    error: err
                    , status: false
                });
            }
            else {
              
                res.json({
                    result: new_event
                    , status: true
                    , message: 'Event Created'
                });
            }
        });
    });
    
    
    app.get('/events', function (req, res) {

        Event.find({"active":true}).exec(function (err, events) {
            if (err) {
                res.json({
                    error: err
                    , status: false });
            } 
            else {
                res.json({
                    result: events,
                    status: true });
            }
        });
    });

    
    app.get('/event/:id', function (req, res) {
  Event.findOne({"active":true, _id:req.params.id}).exec(function (err, event) {
            
            if (err) {
                res.json({
                    error: err ,
                    status: false });
            }
            else {
                 res.json({
                    result: event,
                    status: true });
            }
        });

    });
    
  
    app.put('/event/:id', function (req, res) {

        var updatedEvent = req.body.event;
        updatedEvent.updatedOn = new Date();
    Event.findOneAndUpdate({_id:req.params.id},{$set:updatedEvent},function (err, event) {
            if (err) {

                res.json({
                    status: false,
                    error: err });
            } 
            else {
                res.json({
                    result: event,
                    status: true });
            }
        });
    });
    
    
    app.delete('/event/:id', function (req, res) {
 Event.findOneAndUpdate({_id:req.params.id},{$set:{active:false}},function (err, event) {
            if (err) {

                res.json({
                    status: false,
                    error: err});
            } 
             else {
                res.json({
                    result: event,
                    status: true });
             }
        });
    });
    
    
}
