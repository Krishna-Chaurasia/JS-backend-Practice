import { Router } from "express" // Router comes from express
import { registerUser } from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middleware.js" //new added for file handling

const router = Router()

// providig a route to the router

// router.route("/register").post(registerUser)
// adding middleware(upload); just before registerUser method, so that it can handle files; 
//we came here after req.body in user.controller.js

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

export default router // using default we can give any random name while importing 
//e.g import userRouter from "./routes/user.routes.js" in app.js file