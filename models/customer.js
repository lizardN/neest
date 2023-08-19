var mongoose = require('mongoose');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    code: {type: String, required: true},
  
  
 


 
});

module.exports = mongoose.model('Customer', schema);