var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 
   
   sales:{type:Number,required:true},
    

    
    year:{type:Number,required:true},

 
});

module.exports = mongoose.model('Sales Stats2', schema);