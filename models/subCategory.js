var mongoose = require('mongoose');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
  
  
 


 
});

module.exports = mongoose.model('Sub Category', schema);