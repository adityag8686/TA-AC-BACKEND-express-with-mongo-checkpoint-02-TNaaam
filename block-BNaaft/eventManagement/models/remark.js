var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var remarkSchema = new Schema ({
    author : String,
    content : String,
    
    eventId : {
        type :Schema.Types.ObjectId,
        ref  : 'Event'
    }
},{timestamps : true});


module.exports = mongoose.model( "Remark", remarkSchema );