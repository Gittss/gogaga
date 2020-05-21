const mongoose=require('mongoose')

var userSchema=new mongoose.Schema({
    name:{type:String, required:'Name required'},
    mobile:{type:Number, minlength:10, required:'Number required'}
})

const User=mongoose.model('User',userSchema)
module.exports=User