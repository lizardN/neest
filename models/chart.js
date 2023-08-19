var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 
    productName: {type: String, required: true},
    category: {type: String, required: true},
    barcodeNumber: {type: String, required: true},
    qty:{type:Number,required:true},
   
    customer:{type:String,required:true},
    shop:{type:String,required:true},
   
 
});

module.exports = mongoose.model('Chart', schema);