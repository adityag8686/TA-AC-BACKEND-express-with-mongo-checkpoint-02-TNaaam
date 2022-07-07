var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var Remark = require("../models/remark");

router.get('/:id/edit', (req, res) => {
    var id = req.params.id;
    Remark.findById(id, (err, remark) => {
        if (err) return next(err);
        res.render('updateRemark', { remark });
    });
});

router.post('/:id/update', (req, res) => {
    var id = req.params.id;
    Remark.findByIdAndUpdate(id, req.body, (err, updatedRemark) => {
        if (err) return next(err);
        res.redirect('/event/' + updatedRemark.eventId);
    });
});

router.get('/:id/delete', (req, res, next) => {
    var remarkId = req.params.id;
    Remark.findByIdAndDelete(remarkId, (err, remark) => {
        if (err) return next(err);
        res.redirect('/event/' + remark.eventId);
    });
});

module.exports = router;

