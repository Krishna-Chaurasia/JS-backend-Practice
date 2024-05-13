import multer from "multer";

// we will use diskStorage not the memory storage(because it can full)
const storage = multer.diskStorage(
    // passing objects in diskStorage function 
    { // here destination is key and function is its value
    destination: function (req, file, cb)//req is request which may comes in form of json 
                                       // here multer will have file parameter and will deal with file related things
                                       // so, along with request if any file comes then multer will handle it
                                       // and cb is callback function as a argument in destination function 
    {
        cb(null,"./public/temp") // ./ means same directory
    },
    //passing 2nd object where filename is key and function is its value
    filename: function (req, file, cb) {
        cb(null, file.originalname) // store with original filename
    }

})


export const upload = multer({storage})