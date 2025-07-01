import mongoose,{Schema,Document, Types} from "mongoose"
import DBError from "@/utils/DBError";
import bcrypt from "bcrypt"

interface IUser extends Document{
    name?:string;
    email:string;
    username:string;
    password:string;
    acceptingFeedbacks:boolean;
    personalFeedbacks:Types.ObjectId[];
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    createdAt:Date;
    updatedAt:Date;
}

const userSchema :Schema<IUser>= new Schema({
    email:{
        type:String,
        lowercase:true,
        trim:true,
        required:true,
        unique:true
    },
    username:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    acceptingFeedbacks:{
        type:Boolean,
        default:true
    },
    personalFeedbacks:[{
        type:Schema.Types.ObjectId,
        ref:"Feedback"
    }],
    verifyCode:{
        type:String,
        default:null
    },
    verifyCodeExpiry:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    const user=this;
    if(user.isModified("password")){
        user.password=await bcrypt.hash(user.password,5)
    }
    next();
})

userSchema.methods.comparePassword=async function(password:string){
    return await bcrypt.compare(password,this.password)
}

const User =(mongoose.models.User) || (mongoose.model<IUser>("User",userSchema));

interface ITopic extends Document{
    owner:Types.ObjectId;
    title:string,
    allowingResponses:boolean;
    feedbacks:Types.ObjectId[];
    createdAt:Date;
    updatedAt:Date;
}

const topicSchema :Schema<ITopic>= new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    allowingResponses:{
        type:Boolean,
        default:true
    },
    feedbacks:[{
        type:Schema.Types.ObjectId,
        ref:"Feedback"
    }]
},{
    timestamps:true
})

const Topic = (mongoose.models.Topic) || (mongoose.model("Topic",topicSchema));

interface IFeedback extends Document{
    owner?:Types.ObjectId | null;
    topic?:Types.ObjectId | null;
    note:string;
    updatedAt:Date;
    createdAt:Date
}

const feedbackSchema:Schema<IFeedback> = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    topic:{
        type:Schema.Types.ObjectId,
        ref:"Topic",
        default:null
    },
    note:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

feedbackSchema.pre("save",function(next){
    const feedback = this;
    if(!feedback.owner && !feedback.topic) {
        next( new DBError(403,"Owner or topic not provided while creating the feedback"))
    }

    next();
})

const Feedback = (mongoose.models.Feedback) || (mongoose.model("Feedback",feedbackSchema));

export {
    type IUser,
    User,
    Feedback,
    Topic
}