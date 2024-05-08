import mongoose, {Schema} from "mongoose"; // {Schema} : it means destructing it 
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"



const userSchema = new Schema(
    //go to the ER diagram >> watch the diagram and >> make Schema
    {
        username: {
            type : String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            index:true // index help us to search anything but it is expensive a little
        },
        email: {
            type : String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,   
        },
        fullName: {
            type : String,
            required: true,
            trim:true,  
            index:true 
        },
        avatar: {
            type : String, // because only url will be stored 
             // cloudinary url : we will use its service to deploy/generaten image url
            required: true, 
        },
        coverImage:{
            type:String, //cloudinary url 
        },
        //watchHistory : multiple value will be added so, typeis array
        watchHistory: [
            {
                type:Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:{
            type:String, //passwords are in numeric/string etc. but store password in encrypt format
            required : [true,'Password id required']
        },
        refreshToken:{
            type:String
        }

    },
    {timestamps:true}
)


// pre hook is nothing but a method.
// .pre("when to execute pre hook", we get a call back).
// in call back don't use ()=>{ } ; it cretes problem because in arrow function we don't have
// reference of this keywork i.e we don't have current context.

// it is very imp. to know to current context of the data, hence use function(){}
// these things likee encryptions are complex algorithms, so takes time hence in call back use async : async function(){}
// as pre is a middleware hence it should have access to next i.e function(next){}
// and when the work is done then pass the flas i.e next for further process which means; async function(next){pass next}

userSchema.pre("save", async function (next){
    // when all these fields of model are just about to save; then take a field 'password', encrypt it and then save it 
    
if(!this.isModified("password"))//modified == true,gets converted in false,so if()'s next() didn't executes,it goes below
    return next();

    //here bcrypt will hash the password i.e bcrypt.hash(whom to be hashe, how many rounds to hash)
    this.password = bcrypt.hash(this.password,10)
    
    // after hashing the password; now go for the next()
    // if we will just send like next(); then if user changes any of its field(e.g avatar)
    // then this bcrypt.hash() will hash password again and again, event if there is no modification in password

    // hence we above in this scope we have applied if() condition to check wheather password field is modified or not 
    // if password field modified then run this bcrypt.hash() else don't run it
    next()
})

// now when we export it, we need to check wheater user entered password is correct or not
// so need to create some methods for password verification

userSchema.methods.isPasswordCorrect = async function(password){
   //await bcrypt.compare(give data provided by user in string,this.password) // it's a cryptocraphy so takes time hence use await

  return await bcrypt.compare(password,this.password) // it returns true or false
}

// below method will generate AccessToken
// When access token is generated then it returns, this method does not take time
userSchema.methods.generateAccessToken = function(){
    //jwt's sign({}) method will generate token  
 return   jwt.sign(
        //providing payload
        {
        //below provided info. will be kept by jwt
        // below we are providing payload for signin token
        _id: this._id,   
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    //providing access token
    process.env.ACCESS_TOKEN_SECRET,
    //below expiry
    {
        //expiry kept in this object  
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

)
}

// below method will generate refreshToken
// in exact same way refresh token is generated just like access token only few changes required
userSchema.methods.generateAccessToken = function(){
    return   jwt.sign(
        //providing payload
        {
        //below provided info. will be kept by jwt
        // below we are providing payload for signin token
        // because it keeps on refreshing we kepp less information
        _id: this._id,   
       
    },
    //providing access token
    process.env.REFRESH_TOKEN_SECRET,
    //below expiry
    {
        //expiry kept in this object  
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

)
}
// both tokens are jwt tokens


export const User = mongoose.model("User", userSchema)

