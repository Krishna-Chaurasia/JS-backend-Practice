// write middleware here to logoutUser functionality
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {  //here in parameters res is not used, so we can pass _
    // next denotes that my work is finished,
    // then go for next() e.g go to other middleware 
//now get the access of tokens which is in cookies and req has access of cookies >> in app.js's app.use(cookieParser())
   
/*
we have given access of  tokens in
 return res
   .status(200)
   .cookie("accessToken", accessToken, options) // here "accessToken is key", accessToken and options are values 
   .cookie("refreshToken", refreshToken, options)
   .json(.....
*/

// or for mobile may be user is sending custom header;; go to JWT site and see
// Authorization: Bearer <token> or we can also see in postman's header >> in key column type Authorization
// and in value column type Bearer <token>


// req.cookies?.accessToken ;; means may be cookies have or may not have accessToken so ti may be in header 
// usually name of header is Authorization and replacing Bearer<space> with nothing
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")  
    
    
        if(!token){
            throw new ApiError(401, "Unauthorized request") 
        }
        //now verifying token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
                          // 1st parameter token, 2nd parameter secret key and we are verifying token with real access token
    
        const user = await User.findById(decodedToken?._id)
        .select("-password -refreshToken")
    
        if(!user){ //if user does not exist
            //disduss about forntend
            throw new ApiError(401, "Invalid Access Token")
        }
    
        // if user exists
        req.user = user; // adding new object to this user 
        next()
        // next() is to run the next things e.g in user.router.js filr >> we have a route for logout
         // router.route("/logout").post(verifyJWT, logoutUser)         
         //but first verifyJWT method runs, then 'next()' helps to execute the next method i.e logoutUser method
         // that is the use of next() 

} catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")
}


    // note : middlewares are used in routes >> now go to routes


   })