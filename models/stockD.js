var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaD = new Schema({

    barcodeNumber:{type:String, required:true},
    name: {type: String, required:true },
    category: { type: String, required:true },
    subCategory: { type: String, required:true },
    cases: {type: Number, required: true},
    unitCases: {type: Number, required: true},
    mformat: {type: String, required: true},
    code: {type: String, required: true},
    status: {type: String, required: true},
    customer: {type: String, required: true},
    shop: {type: String, required: true},
   
   
});

module.exports = mongoose.model('StockD', schemaD);