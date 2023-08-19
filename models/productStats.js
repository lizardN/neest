var mongoose = require('mongoose');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
  
    id: {type: String, required: true},
    qty: {type: Number, required: true},
    code: {type: String, required: true},


    category: {type: String, required: true}
});

module.exports = mongoose.model('Product Stats', schema);