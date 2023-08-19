var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type: String, required: true},
    category: {type: String, required: true},
    num: {type: Number, required: true},
    role:{type:String,required:true},
    photo:{type:String,required:true},
    photo2:{type:String,required:true},
    username:{type:String,required:true},
    username2:{type:String,required:true},
    status:{type:String,required:true},
    userId:{type:String,required:true},
    fullname:{type:String, required:true},
    autoCustomer:{type:String, required:true},
    customer:{type:String, required:true},
    shop:{type:String, required:true},
    merch:{type:String, required:true},
    dateAdded:{type:String, required:true},
    dateModified:{type:String, required:true},
    password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

module.exports = mongoose.model('User', userSchema);