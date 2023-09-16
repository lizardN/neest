var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var discodeSchema = new Schema({
   


   code: {type: String, required: true},
   mformat: {type: String, required: true},
   customer: {type: String, required: true},
   shop: {type: String, required: true},
   


  

});

module.exports = mongoose.model('Dispatch Code', discodeSchema);