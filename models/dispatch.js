var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    barcodeNumber:{type:String, required:true},
    name: {type: String, required:true },
    category: { type: String, required:true },
    quantityDispatched: {type: Number, required: true},
    unitCases: {type: Number, required: true},
    cases: {type: Number, required: true},
    cases: {type: Number, required: true},
    casesDispatched: {type: Number, required: true},
    quantityVariance: {type: Number, required: true},
    dispatcher: {type: String, required: true},
    status: {type: String, required: true},
    status2: {type: String, required: true},
    status3: {type: String, required: true},
    customer: {type: String, required: true},
    shop: {type: String, required: true},
    receiver: {type: String, required: true},
    qtyReceived: {type: Number, required: true},
    casesReceived: {type: Number, required: true},
    dateDispatched:{type:String, required:true},
    dateDispatchedValue:{type:String, required:true},
    dateReceived:{type:String, required:true},
    dateReceivedValue:{type:String, required:true},
    rate: {type: Number, required: true},
    zwl: {type: Number, required: true},
    mformat: {type: String, required: true},
    month: {type: String, required: true},
    year: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Dispatch', schema);