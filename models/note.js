var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 

    role: {type: String, required: true},
    type: {type: String, required: true},
    message: {type: String, required: true},
    subject:{type:String,required:true},
    user:{type:String,required:true},
    status: {type: String, required: true},
    status1: {type: String, required: true},
    status2: {type: String, required: true},
    status3: {type: String, required: true},
    customer: {type: String, required: true},
    shop: {type: String, required: true},
    date: {type: String, required: true},
    status4:{type:String, required:true},
    dateViewed: {type: String, required: true},
    recId:{type:String, required:true},
    recRole:{type:String,required:true},
    senderPhoto:{type:String,required:true},
    numDate: {type: Number, required: true},
 
});

module.exports = mongoose.model('Note', schema);