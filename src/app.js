import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // or import cookie-Parser from "cookie-parser"

// uses of cookieParse :: is that, from our server we can access/set cookies of user from its browser
// basically we can perform crud operation on our user's cookies because
// there are some ways through which we can keep secure cookies in user's browser and only server can read/remove it 

// usually we create app(just common name of variable) using express

const app = express()

// Most of the time when data comes from URL, it is in the form of params i.e req.params
// and req.body and req.cookies (we need npm package: cookie-parser middleware) i.e use for resource sharing

//** app.use() // it is used for middleware and other configuration */

app.use(cors({
    origin: process.env.CORS_ORIGIN,// it tells which origin you are allowing and generally origin is allowed from process.env.CORS_ORIGIN 
    Credential:true  // press ctrl + space to see other options

}))

//**   NOTE:: data will come from many places/format like json, url, body(form)   
// so we need to prepare for these format

//** below app.use() is used for configuration */

 // we use app.use() for configuration and setting middleware
 // and express.jsong({limit: "16kb"}) is used to accept the json format data set limit for json data

app.use(express.json({limit: "16kb"}))

// expess.urlencoded is used to accept the url encoded data; 
//encoded data means accept data from any type of browser's format e.g https://krish%20kuamr or https://krish+kumar
// using extended:true, we can provide nested object of data i.e inside object's of object 

app.use(express.urlencoded({extended:true, limit:"16kb"}))

//express.static :: it is used to store pdf, file, folder, images
// and it saved in public folder >> so that anyone can access
app.use(express.static("public"))

// for cookies use app.use(cookieParser())
app.use(cookieParser())














export { app }  // we can export like this also export { app }