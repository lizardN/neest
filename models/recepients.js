var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 

    msgId: {type: String, required: true},
    recepientName: {type: String, required: true},
    recepientEmail: {type: String, required: true},
    numDate: {type: Number, required: true},
    status: {type: String, required: true},
    statusX: {type: String, required: true},
    statusXX: {type: String, required: true},
    statusCheck: {type: String, required: true},
    archive: {type: String, required: true},
    read: {type: String, required: true},
    recepientId: {type: String, required: true},
  

 
});

module.exports = mongoose.model('Recepient', schema);