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


//routes import 
import userRouter from './routes/user.routes.js'

//router declaration

// before importing we were using app.get() becauing previously using app we were writing routes and controller here itself
// but now since we have separated contrller and routes so we need to bring them back using middleware
// hence apply app.use()  instead of app.get()
// and now in app.use("here can provide all routes",which router to activate)


//app.use("/users",userRouter) // it will go to user router file
// Url will be like : http://localhost:8000/users/register

// instad of using app.use("/users",userRouter) ;; we will use /api isntaed of /users
app.use("/api/v1/users",userRouter) //v1 is version of api which is 1 here
// if someone comes on "/api/v1/users" it will pass to userRouter

// now url will be:: http://localhost:8000/api/v1/users/register







export { app }  // we can export like this also export { app }