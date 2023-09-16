var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaR = new Schema({

    barcodeNumber:{type:String, required:true},
    name: {type: String, required:true },
    category: { type: String, required:true },
    qtyReturned: {type: Number, required: true},
    customer: {type: String, required: true},
    shop: {type: String, required: true},
    mformat: {type: String, required: true},
    status: {type: String, required: true},
   
   
});

module.exports = mongoose.model('StockR', schemaR);