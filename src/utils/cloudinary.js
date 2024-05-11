import {v2 as cloudinary} from "cloudinary" // extract v2 from cloudinary and renamed as cloudinary

import fs from "fs" 
/*
37) fs library is a file system and it comes with nodejs bydefault >> fs library of nodejs helps to read/write/remove
 file in as sync or async way etc 

37.1) most important is 'fsPromise.unlink(path) >> in our file system, files are in a linked or unlinked >>
 when we delete any file, then it is unlinked >> but file is still kept there >> so if we have to 
 delete or remove file then use 'unlink' function of fsPromise library
*/

/*
cloudinary.config({ 
  cloud_name: 'dofo7horv', 
  api_key: '817744396351155', 
  api_secret: 'lUm7svFyJSj1k3-1F_NKqjpcF0c' 

  go to env file and change names of 'cloud_name', 'api_key', 'api_secret'
});
*/

       
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// now above we have proper cloudinary configration

/*
// now we will use this to upload files to cloudinary

cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });

// but we will first organise it with some methods
*/

// there may be some problems while uploading files on cloudinary so use try catch just like database connection
// try{ } catch(){ } and this operation takes time so use async


const uploadOnCloudinary = async (localFilePath) =>{
  try {
    if(!localFilePath) // if localFilePath is not present
    return null

    //upload the file on cloudinary and it takes time so use await
   const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto" // resource_type has many options like image,video,raw and auto(it detects automatically)
    })
    // file has been uploaded successfully
    console.log("file is uploaded on cloudinary : ",response.url ); //after uploading we want public url

    return response // we are returning response for the user 
  } 
  
  catch (error) {
    // if file is not uploaded then for our safe purpose we should remove it from our server, so use unlink(in a synchronous)
    // if file upload failed and it is not removed from our server then many corrupted and malicious file will be left behind

    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed 
    return null;

  }
}

export {uploadOnCloudinary}


