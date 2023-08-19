var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var presetSchema = new Schema({
   


   merchandiser: {type: String, required: true},
    shop: {type: String, required: true},
    photo: {type: String, required: true},
    customer:{type:String, required:true},
    username:{type:String, required:true},
    dateAdded:{type:String, required:true},
    dateModified:{type:String, required:true},
    userId:{type:String, required:true},


  

});

module.exports = mongoose.model('Preset', presetSchema);