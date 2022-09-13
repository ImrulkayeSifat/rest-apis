import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{type:String,required:true},
  email:{type:String,require:true,unique:true},
  password:{type:String,require:true},
  role:{type:String,default:'customer'}
},{timestamps:true});

export default mongoose.model('User',userSchema,'users');