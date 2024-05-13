//creating a class to send response to someone when required 

class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400  // there are specific statusCode on server 
                  // every statusCode has their own purpose
    }
}

export {ApiResponse}

