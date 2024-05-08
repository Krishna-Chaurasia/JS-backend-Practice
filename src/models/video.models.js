import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema  = new Schema(
    {
        videoFile : {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title:{
           type: string,
           required: true
        },
        description:{//when we upload video on cloudinary, it provides link of the video with full details(e.g duration)
            type: Number,
            required: true
         },
         views:{
            type:number,
            default:0
         },
         isPublished: {// it tells wheater video is publically availble or not
            type: Boolean,
            default:true
         },
         owner:{
            type:Schema.Types.ObjectId,
            ref: "User"
         }

    },
    {timestamps:true}
)

// we are adding our own plugin in mongoose with the help of aggregatePaginate
// then we can write aggregate queries 
videoSchema.plugin(mongooseAggregatePaginate) // it will come in future



export const Video = mongoose.model("Video",videoSchema)

