var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 
   
    bestSellingCustomer:{type:Number,required:true},
    bestSellingStore:{type:Number,required:true},
    bestSellingCategory:{type:Number,required:true},
    bestSellingProduct:{type:Number,required:true},
    bestSellingCustomerX:{type:String,required:true},
    bestSellingStoreX:{type:String,required:true},
    bestSellingCategoryX:{type:String,required:true},
    bestSellingProductX:{type:String,required:true},
    year:{type:Number,required:true},

 
});

module.exports = mongoose.model('Sale Stats', schema);