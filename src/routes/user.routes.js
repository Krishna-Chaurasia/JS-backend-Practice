import { Router } from "express" // Router comes from express
import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js" //new added for file handling
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router() 

// Here, a new instance of the Router class is created and assigned to the variable router.
//  The Router class is provided by the Express.js framework. It is used to define routes for
//   handling HTTP requests in a Node.js web application.

// providig a route to the router

// router.route("/register").post(registerUser)
// adding middleware(upload); just before registerUser method, so that it can handle files; 
//we came here after req.body in user.controller.js

//creating a route name register i.e(http/register) and if anyone on this route will
// call registerUser method in user.controller.js
// post() method is used to receive data from client
router.route("/register").post(
    // to accept multiple files use fields and it accepts array
    upload.fields([
        // here we are accepting 2 files i.e avatar and cover image
        {name:"avatar",
        maxCount:1 // only one file is accepted
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser // now we can use registerUser method but just before executing, it will execute the middleware name upload

)

//creating another route name login i.e(http/login) and if anyone on this route will
// call loginUser method in user.controller.js
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser) //but before logoutUser method, it will execute the middleware name verifyJWT

router.route("/refresh-token").post(refreshAccessToken)

export default router // using default we can give any random name while importing 
//e.g import userRouter from "./routes/user.routes.js" in app.js file