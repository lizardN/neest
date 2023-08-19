var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    barcodeNumber:{type:String, required:true},
    name: {type: String, required:true },
    category: { type: String, required:true },
    openingQuantity: {type: Number, required: true},
    rcvdQuantity: {type: Number, required: true},
    quantity: {type: Number, required: true},
    unitCases: {type: Number, required: true},
    cases: {type: Number, required: true},
    
    rate: {type: Number, required: true},
    zwl: {type: Number, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Product', schema);