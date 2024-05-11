import { Router } from "express" // Router comes from express
import { registerUser } from "../controllers/user.controller.js"

const router = Router()

// providig a route to the router
router.route("/register").post(registerUser)
//router.route("/login").post(login)

export default router // using default we can give any random name while importing 
//e.g import userRouter from "./routes/user.routes.js" in app.js file