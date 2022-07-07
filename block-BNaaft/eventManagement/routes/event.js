var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var Remark = require("../models/remark");

// adding a event
router.get("/new", (req, res)=>{
    res.render("eventForm");
});

// posting an event

router.post("/new", (req, res, next) => {
    Event.create(req.body, (err, event) => {
        console.log(event);
        if (err) return next(err);
        res.redirect("/event");
    });
});
// all events 

router.get("/", (req, res, next) => {
    Event.find({}, (err, event) => {
        if (err) return next(err);
        res.render("event", { event : event });
    });
});


// details about each event

router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Event.findById(id)
        .populate('remarks')
        .exec((err, event) => {
            if (err) return next(err);
        res.render('eventDetails', { event });
    });
});

// update event get request

router.get("/:id/edit",(req,res,next)=>{
    var id = req.params.id;
    Event.findById(id,(err,event)=>{
        if (err) return next(err);
    res.render('updatedetails', { event: event });
    })
})

// once updated post request

router.post("/:id",(req,res,next)=>{
    var id = req.params.id;
    Event.findByIdAndUpdate(id,req.body,(err,event)=>{
        if (err) return next(err);
        res.redirect("/event/" + id);
    })
})

// Deleting Event 

router.get('/:id/delete', (req, res) => {
    var id = req.params.id;
    Event.findByIdAndDelete(id, (err, deletedEvent) => {
        if (err) next(err);
        res.redirect('/event');
    });
});

// likes
router.get("/:id/likes", (req,res,next) => {
    var id = req.params.id;
    Event.findByIdAndUpdate(id, {$inc :{likes: +1}}, (err, event) =>{
        if(err) return next(err);
        res.redirect("/event/" + id);
    })
})

// dislike
router.get('/:id/dislike', (req, res, next) => {
    var id = req.params.id;
    Event.findById(id, (err, event) => {
        if (err) return next(err);
        if (event.likes === 0) {
        Event.findByIdAndUpdate(id, { likes: 0 }, (err, event) => {
            if (err) return next(err);
            res.redirect('/event/' + id);
        });
        } else {
        Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
            if (err) return next(err);
            res.redirect('/event/' + id);
        });
        }
    });
});

// handling post request on comment/remark

router.post('/:id/remark', (req, res, next) => {
    var id = req.params.id;
    req.body.eventId = id;
    Remark.create(req.body, (err, remarks) => {
        Event.findByIdAndUpdate(id,{ $push: { remarks: remarks._id } },{ new: true },
        (err, updatedRemark) => {
            if (err) return next(err);
            res.redirect('/event/' + id);
        });
    });
});



module.exports = router;