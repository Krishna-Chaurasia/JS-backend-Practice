import { asyncHandler } from "../utils/asyncHandler.js";
// it will handle if any error comes using promises

import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

// registering user : below registerUser method using asyncHandler which is higher order function & accepts function i.e asyncHandler()
// creating a method name registerUser
 const registerUser = asyncHandler( async (req, res) => {
    //give return to end the funtion because it may or may not give error
    // res.status(200).json({
    //     message: "ok"
    // })

    //****** think about these process that if user is registerd or not *****/

    // 1) get user details from frontend
    // 2) validation - not empty
    // 3) check if user already exist: username, email
    // 4) check for images, check for avatar
    // 5) upload them to cloudinary, avatar
    // 6) create user object(create entry in db): because when we send data to mongodb we need to send object 
                                               //as mongodb is nosql

    // 7) remove password and refresh token field from response
    // 8) check for user creation 
    // 9) return response

    // 1) now below code is for validation 
    // 1.1) we get user details from user using req.body
      // if data is coming from directly form and json we can use req.body
      // if data is coming from url we need to handle it differently
    
      const {fullName, email ,username, password } = req.body // we are extracting data coming from req.body 
                                                              // and destructuring it sending details like email etc. 
    console.log("email: ", email);
    // open post man; see step 45 in 00_note.md
    // now to handle files we need to use multer, go to routes and see
    
    // 2) validation

    // if(fullName === ""){
    //    throw new ApiError( 400,"fullname is required") // we are giving response of ApiError
    // }

    //or 

    if(
        [fullName,email,username,password].some((field) => // here field is fullName,email,username,password
        field?.trim() === "") // if field is available apply trim() and applying trim if field is empty return true
    ){
        throw new ApiError( 400,"All fields are required")
    }

    // 3) check if user already exist: username, email
    // 3.1) import {User} from "../models/user.models.js"
    //const userexisted = User.findOne({email}) // it will check only email 
    const existedUser = await User.findOne({
        //using operator(or) by using $ so $or:[{},{},{},{},{}] // it checks for more than one field
        $or:[{email},{username}] // it returns, if either email or username i.e whichever matches first
    })

    if(existedUser){
        throw new ApiError( 409,"User with email or username already exist")
    }

    // we get all of the data in req.body by express
    // but we added middleware in routes; so multer will give us; req.files 
const avatarLocalPath=req.files?.avatar[0]?.path;//file name:avatar;because same name given in middleware user.routes.js
                    // and avatar[0] is first property(it has a object) and ?.path is used to extract path due to [0]
                   // and  multer will the file on our local server in ./public/temp; check multer.middleware.js file

//const coverImageLocalPath=req.files?.coverImage[0]?.path; // it may give error; if image is not uploaded then undefined
                                                        // and it not possible to extract path from undefined
    let coverImageLocalPath;  //scope issue so use let instead of const
    if(req.files && Array.isArray(req.files.coverImage) //Array.isArray : because files contains its info. in array
    && req.files.coverImage.length > 0)//req.files.coverImage.length>0; if array then its size will be greater than 0
    {
      coverImageLocalPath = req.files.coverImage[0].path
    }

    // 4) check for images, check for avatar
    if(!avatarLocalPath){
        throw new ApiError( 400,"Avatar file is required")
    }

    // 5) upload them to cloudinary, avatar(must)
    // 5.1) import {uploadOnCloudinary} from "../utils/cloudinary" 

    //use await(until this task is not finished) because it takes time 
    const avatar = await uploadOnCloudinary(avatarLocalPath) 
                           // the method uploadOnCloudinary will need file path as argument hence given
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // 5.2) check again if avatar is uploaded or not 
    if(!avatar){
        throw new ApiError( 400,"Avatar file pload failed")
    } 

    // 6) create user object(create entry in db): because when we send data to mongodb we need to send object 
    // as mongodb is nosql
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
       
       
    })

    // 7) remove password and refresh token field from response

    // MongoDB automatically creates _id field for each document
    const cretedUser = await User.findById(user._id).select(
        "-password -refreshToken"// these fiels will not be sent in response 
    )

    // 8) check for user creation
    if(!cretedUser){
        throw new ApiError( 500,"Something went wrong while creating user") 
    }
   
    // 9) return response
    // need to import {ApiResponse} from "../utils/ApiResponse"

    return res.status(201).json( // json response's architecture is defined in ApiResponse.js
        new ApiResponse(200,cretedUser, "User Registered successfully") // 3rd parameter is message
    )

    })

 export {registerUser}

 // now creating routes // so that nodejs can come to know that when these methods shoud run 
 // go to src >> routes >> create a file user.routes.js