import mongoose,{Schema,Document, Types} from "mongoose"
import DBError from "@/utils/DBError";
import bcrypt from "bcrypt"

interface IUser extends Document{
    name?:string;
    email:string;
    username:string;
    password:string;
    avatar_url?:string;
    acceptingFeedbacks:boolean;
    personalFeedbacks:Types.ObjectId[];
    verifyCode:string | null;
    verifyCodeExpiry:Date | null;
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
    avatar_url:{
        type:String,
        default:"https://imgs.search.brave.com/6wkaBbsmkyuEl7tbLrfD-ZYYiaR8FxHZfH_4EVzu9wk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDAv/MjQzLzQxNy9zbWFs/bC9zcHktaWNvbi12/ZWN0b3IuanBn"
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
        default:null
    },
    isVerified:{
        type:Boolean,
        default:true
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
    allowingFeedbacks:boolean;
    feedbacksPublic:boolean;
    thumbnail_url?:string;
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
    allowingFeedbacks:{
        type:Boolean,
        default:true
    },
    feedbacksPublic:{
        type:Boolean,
        default:true
    },
    thumbnail_url:{
        type:String,
        default:null
    }
},{
    timestamps:true
})

const Topic = (mongoose.models.Topic) || (mongoose.model("Topic",topicSchema));

interface ITopicReport extends Document{
    topicId:Types.ObjectId;
    rating:number;
    nPositive:number;
    nNegative:number;
    improvements:string[];
    createdAt:Date;
    updatedAt:Date;
}

const topicReportSchema:Schema<ITopicReport> = new Schema({
    topicId:{
        type:Schema.Types.ObjectId,
        ref:"Topic",
        required:true
    },
    rating:{
        type:Number,
        default:null
    },
    nPositive:{
        type:Number,
        default:null
    },
    nNegative:{
        type:Number,
        default:null
    },
    improvements:{
        type:[String],
        default:[]
    }
},{
    timestamps:true
})

const TopicReport =mongoose.models.TopicReport || mongoose.model("TopicReport",topicReportSchema);

interface IFeedback extends Document{
    owner?:Types.ObjectId;
    topicId?:Types.ObjectId | null;
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
    topicId:{
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
    type ITopic,
    User,
    Feedback,
    Topic,
    TopicReport
}