// create a class ApiError which extends Error class
class ApiError extends Error {
    // In this class Erros constructor are avialble
    // but we are declaring our own constructor
    
    //overwriting the below constructor properties 

    constructor(
        // these  below codes will be overwrite
        statusCode,
        message = "Something went wrong", 
        errors = [],
        statck = ""
    ){ 
        //we overwrite things in constructor in { use call super(message) }
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.error = error
        this.statck = statck
        this.data = null // removing data field
        this.success = false;
        this.errors = errors

        // below code is for tracking Api errors 

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }
