var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopSchema = new Schema({
   


   name: {type: String, required: true},
    customer:{type:String, required:true},


  

});

module.exports = mongoose.model('Shop', shopSchema);