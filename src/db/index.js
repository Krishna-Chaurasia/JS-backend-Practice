// in this file we will connect database through mongoose 
 import mongoose from "mongoose";
 import { DB_NAME } from "../constants.js";

// in below function we use async method function, so after completing async method we need to retunr a prommise.
// and this promise is returned in src >> index.js >> connectDB().then(give succes message).catch(handle error)

 const connectDB = async () => {
    try {
        // mongoose gives return object; so we can store below code in variabel 
        const connectionINstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // DB_NAME is name of DB
    
        console.log(`\n MongoDB connected !! DB HOST : ${connectionINstance.connection.host}`)
    }
   
    catch(error){
        console.log("MONGODB connection failed", error);
         
        // nodejs provides access to process(can be used anywhere), 
        // and our current application running on some process; 
        // and below process.exit is reference of that process
       
        process.exit(1) // here 1 is exiting from node process failure
    }
 }


 export default connectDB // now we can export this file 