// we will use promises/try-catch for asyncHander 

const asyncHandler  = (requestHandler) => {
   return (req, res, next) =>{ // we need to return the it as a function because we are accepting it as function
        //Promise.resolve().reject() or Promise.resolve().catch)=()

        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))

    }
}








export { asyncHandler } // export default asyncHandler



//**** 2nd way  

/*

// asyncHandler is higher order function which means those 
// functions which can accept function as a parameter or return
// return

//const asyncHandler = (fn) => async() => { }
//const asyncHandler = (fn) => {  async() => { }  }

const asyncHandler=(fn)=>//(fn):we have accepted function fn in the parameter so further need to pass fn in another function
 { async(req, res, next)  => // when we run this async function we pass (req,res,next);; next is used for middleware
{
    try {
        // we use await because async is created
        //we are executing the function which is created
        await fn(req,res,next)
    } 


    catch (error) {
         
    // if user passing error then err.code else 500 & further we send json respose so that it is easy for frontend developer
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
        
    }
}
 }


*/


