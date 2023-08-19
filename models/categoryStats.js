var mongoose = require('mongoose');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    category: {type: String, required: true},
  
  
    qty: {type: Number, required: true},
    code: {type: String, required: true},


 
});

module.exports = mongoose.model('Category Stats', schema);