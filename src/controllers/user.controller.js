// now creating routes // so that nodejs can come to know that when these methods shoud run 
 // go to src >> routes >> create a file user.routes.js
import { asyncHandler } from "../utils/asyncHandler.js";
// it will handle if any error comes using promises

import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

// Generates both access and refresh tokens for the specified user
const generateAccessAndRefreshTokens = async (userId)=>
    {
    try{
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       // Note : access token is provided to the user 
       // but refresh token is provided to the user as well as saved in db,
       // so that no need to ask for password again and again
        
       
       // adding refresh token in user database; so that user can hit the end 
       //point with this refresh token and remain logged in

       // hence adding value inside the object 
       user.refreshToken = refreshToken
       // now saving in db for that user 
        //but when we save there is need for password
       await user.save({validateBeforeSave:false}) // there will be no validation before saving 
                                                    //refresh token in db of userSchema

       return {accessToken,refreshToken}

    } catch(error){
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


// Registers a new user with the provided details

// registering user : below registerUser method using asyncHandler which is higher order function & 
//accepts function i.e asyncHandler()
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

    //******* Now login user ********/
    // Logs in a user with the provided credentials

const loginUser = asyncHandler(async (req, res) => {
    //   requirement for login sytem 
    //1) get data from req body
    //2) give access on the basis of username or email or both
    //3) find the user
    //4) if user found then password check
    //5) if password is correct then generate & give access and refresh token
    //6) send cookies(securely)


    // 1) get data from req body
    const {email,username, password } = req.body;
    console.log(email);
    // 2) give access on the basis of username or email or both
    if(!email && !username){ // both email and username are required
        throw new ApiError( 400,"email or username is required")
    }
    
    // Here is an alternative of above code based on login 
    // if(!(email || username)){// it will tell that either email or username is required
    //     throw new ApiError( 400,"email or username is required")
    // }
   
    
    //2.1) finding the existed username or email and since data is in another continent so it takes time hence use await
   const user = await User.findOne({ // $ is operator of mongoDB
        $or:[{email},{username}] // it returns, if either email or username i.e whichever matches first
    })
    //2.2) if user not found
    if(!user){
        throw new ApiError( 404,"User does not esist")
    }

    // 3) if user found then password check 
    // 3.1) user will enter its password we will get from req.body
    // 3.1) saved password we will get from db using this.password
    
    //4) if user found then password check
    const isPasswordValid = await user. isPasswordCorrect(password) //don't use capital User, it's mongoose object 
                                //so, use small user as it is instance of User i.e const user = await User.findOne()

      if(!isPasswordValid){
        throw new ApiError( 401,"Invalid user credentials")
    }

    //5) if password is correct then generate & give access and refresh token
       // on the very above a method with name generateAccessAndRefereshTokens is created; so use it for this puppose 

   const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)//destructured and taken values from it


   //6)send cookies(securely) : we have called user above
   // before const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id) 
   // hence above user haven't saved refreshToken in db
   // now we need to call datase one more time after 
   //const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).
   select("-password -refreshToken")// these fiels will not be sent in response
   

   // 6.1) send cookies
   // 6.2) we need to design some options for cookies
   const options = {
    httpOnly:true,
    secure:true
    // when we make above keys as true then it can be modified by server only
    // if false then it can be modified by browser as well or frontend
   }

   // 6.3) now returning some response from this method 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options) // here "accessToken is key", accessToken and options are values 
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse(200,
   {
    user: loggedInUser, accessToken, refreshToken//when user may want to save it,may be he is storing in local storage  
    },
    "User logged in successfully"
     )
   ) 


})


// ******* Now logout User ******/
// Logs out the current user and clears authentication tokens

const logoutUser = asyncHandler(async (req, res) => {
        //  for logoutUser >> go to src >> middleware >> create a file name auth.middleware.js >> 
        //add middleware here  >> and this middlware will verify that wheather user is present or not

        // 1) remoe refresh token from db
        
        await  User.findByIdAndUpdate(
            req.user._id, //getting user id
            {
                // now updating in mongodb
                // we can update using $set
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true // the response will be get in return will be updated
            }
        )
      
        // 2) now clearing cookies
        const options = {
            httpOnly:true,
            secure:true
              }
        
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully")) //{} : it means sending empty data
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    // 1) get refresh token
    //1.1) refresh token will come from cookies 
    // 1.2) refresh token will come from req.body for mobile application
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken //will come from user
    // we also have saved refreshToken in our db
    // 2) if refresh token is not present
    if(!incomingRefreshToken){
        throw new ApiError( 401,"Please login again to generate new access token or unauthorized access")          
    } 
    // 2.1) now verify refresh token that is coming from user
    //2.1.1) import jwt from "jsonwebtoken" for verification
    //2.2) the tokens which user receives is in the form of encrypted string
    //2.3) jwt.verify() is used for verification of tokens >> and decodes the encrypted string i.e token
 try {
       const decodedToken = jwt.verify(
           incomingRefreshToken, 
           process.env.REFRESH_TOKEN_SECRET
       ) // now our incoming token have been converted to decoded token
       
       //3) while creating refresh token we stored user id in it
       //3.1) now we are getting user id from decoded token 
   
       const user = await User.findById(decodedToken._id) // getting user id from decoded token and saved in user
       // here the User came from user.models.js and imported above 
       if(!user){
           throw new ApiError( 401,"Invalid Refresh Token")  
       }
   
       // checking db's refresh token and user's refresh token are same or not 
       // we have saved refreshToken(as a key) in db in userschema model 
       if(incomingRefreshToken !== user?.refreshToken){
           throw new ApiError( 401,"Refresh token is expires or used")
       }
       //4) if refresh token is valid and matached with user's refresh token
       // 4.1) now generating new access token with above created method generateAccessAndRefreshTokens
       const options = {
           httpOnly:true,
           secure:true
             }
        // generating will take time as it will save in database 
       const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
   
      //   4) now sending response
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("newrefreshToken", newRefreshToken, options)
      .json(
           new ApiResponse(
               200,
               { accessToken, refreshToken: newRefreshToken },
               "Access token refreshed successfully"
           )    
      )
 } 
 catch (error) {
    throw new ApiError( 401, error?.message || "Invalid Refresh Token")
 }


    /*
    you are verifying the refresh token twice, which might seem redundant at first glance. However,
     these two checks serve different purposes:

1)Token Decoding and Validation (using jwt.verify):

This step ensures that the refresh token is valid and has not been tampered with. It decodes the token to extract
 the payload, such as the user ID. This step guarantees that the token is structurally correct and was signed using
  the correct secret key.
jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET) checks the token's integrity and authenticity.

2)Token Matching (comparing tokens):

After decoding and verifying the token, you need to ensure that the token presented by the user matches the one
 stored in your database. This step is crucial to prevent replay attacks.
By checking if(incomingRefreshToken !== user.refreshToken), you confirm that the refresh token provided by the
 user is the same as the one stored in the user's record in the database.
    */

})


 export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
 }

 