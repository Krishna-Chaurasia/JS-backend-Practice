import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema({
        name:{
            tyep:String,
            required: true
        },
        description:{
            tyep:String,
            required: true
        },
        videos:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
        
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }  
},{
    timestamp:true
})


export const Playlist = mongoose.model("Playlist",playlistSchema)

