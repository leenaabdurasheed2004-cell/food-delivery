import mongoose  from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://leenaabdurasheed:987654321@cluster0.714oisy.mongodb.net/food-del").then(()=>console.log("DB Connected"))
    // await mongoose.connect("mongodb://localhost:27017").then(()=>console.log("db connected")
    // )
}