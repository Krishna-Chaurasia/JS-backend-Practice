import { asyncHandler } from "../utils/asyncHandler.js";
// it will handle if any error comes using promises

// registering user : below registerUser method using asyncHandler which is higher order function & accepts function i.e asyncHandler()
// creating a method name registerUser
 const registerUser = asyncHandler( async (req, res) => {
    //give return to end the funtion because it may or may not giv error
    res.status(200).json({
        message: "ok"
    })
 })

 export {registerUser}

 // now creating routes // so that nodejs can come to know that when these methods shoud run 
 // go to src >> routes >> create a file user.routes.js