var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 
    productName: {type: String, required: true},
    category: {type: String, required: true},
    barcodeNumber: {type: String, required: true},
    qty:{type:Number,required:true},
    date:{type:String,required:true},
    dateValue:{type:Number,required:true},
    mformat:{type:String,required:true},
    month:{type:String,required:true},
    year:{type:Number,required:true},
    price: {type: Number, required: true},
    customer:{type:String,required:true},
    shop:{type:String,required:true},
    openingStock:{type:Number, required:true},
    newStock:{type:Number, required:true},
 
});

module.exports = mongoose.model('Sales', schema);