// As early as possible in your application, import and configure dotenv:

//require('dotenv').config ({path:'./env'})
//or
import dotenv from "dotenv"
dotenv.config({
    path: './env'
})  // now got to package.json >> in script >> in dev's value add : '-r dotenv/config --experimental-json-modules' in b/w nodemon and src/index.js


import mongoose, { connect } from "mongoose"; //mongoose helps to connect with database 
import { DB_NAME } from "./constants.js"; // importing DB_NAME from constants.js file
import connectDB from "./db/index.js";
import {app} from "./app.js"


// connecting and exporting 2nd approach of DB
connectDB() 
.then(()=>{
    //we will use app and listen in app ; so that our server can start
    app.listen(process.env.PORT || 8000, ()=>{
        console.log`Server is runnig at port : ${process.env.PORT}`
    }) // default PORT is 8000
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ",err);
})








/*       1st   Approach   of connecting MongoDB database 

//**** sometime we initialize app which is formed from express 
import express from "express";
const app = express()


//****  function for connection of Database
 function connectDB(){ }  
 //**execution of DB 
 connectDB()

 //**** better approach for DB connction & execution is IIFE(Immediately Invoked Function Expression)
// (this is function i.e contains arrow function ) (immediate execution of function)
// below arrow function is async


// always give semi-colon(;) before the staring of IIFE function because if previous code doesn't have
// ending ; then it may create problem
 


;( async ()=>{

    //provide try-catch because taling with DB
    // if everything fine then execute try{ } else catch(){ }
    
    try {

        //when we talk with .env file use process.env.Variable_nameto get access of variable
        
        await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // DB_NAME is name of DB
        
        //sometime we use app.on which has listener, it can listen like error   
        // it is because our database is connected but our express's app is not able to communicate                                     
        
        app.on("error", (error)=>{    //(reveiving error) => { }
            console.log("Error: our application(express) is able to talk to database : ",error);
            throw error // throw error when not able to communicate
        }) 

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    
    }

    catch(error){
        console.error("ERROR: ", error) // or console.log("ERROR: ", error)
        throw err // throw error 
    }

} ) ()

*/


