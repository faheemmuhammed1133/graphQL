import mongoose from "mongoose";

export default function connectDB(){
   mongoose.connect("mongodb://localhost:27017/productms")
   .then(()=>{
      console.log("db connected")
   })
   .catch((err)=>{
      console.log(err)
   })
}