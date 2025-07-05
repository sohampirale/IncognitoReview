import { maxHeaderSize } from "http"
import mongoose, { mongo } from "mongoose"
import {z} from "zod"

/**
 * username
 * email
 * password
 * note
 * title
 * userId
 * topicId
 * feedbackId
 */

/**
 * getMe
 * signup
 * login
 * createTopic
 * getAllFeedbacksOfTopic
 * giveFeedback
 * toggleTopicAllowingFeedbacks
 * updateTopicTitle
 * deleteTopic
 * deleteFeedback
 * verifyEmail
 */

const usernameSchema = z
    .string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/,"Username cannot include special characters")  
    .transform((val)=>val.toLowerCase())

const emailSchema=z
    .string()
    .email()
    .min(5)
    .max(100)
    .transform((val)=>val.toLowerCase())

const passwordSchema=z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must include at least one uppercase letter, one lowercase letter, one number, and one special character")

const noteSchema = z
    .string()
    .max(5000)

const titleSchema = z
    .string()
    .min(2)
    .max(50)

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/,"Invalid ObjectId")
    .transform((id)=>new mongoose.Types.ObjectId(id))

const OTPSchema= z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => val.length === 6, {
        message: "OTP must be exactly 6 characters",
    });

const toggleAcceptingFeedbacksSchema=z
    .boolean()


// const getMeSchema=z.object({

// })


const signUpSchema = z.object({
    username:usernameSchema,
    email:emailSchema,
    password:passwordSchema
})

const loginSchema = z
    .object({
        username:usernameSchema.optional(),
        email:emailSchema.optional(),
        password:passwordSchema
    })
    .refine((data)=>data.username || data.email,"Atleast username or email is required")

const loginSchema2 = z.object({
    identifier:z.string(),
    password:passwordSchema
})

const createTopicSchema = z.object({
    title:titleSchema
})

const getAllFeedbacksOfTopicSchema = z.object({
    topicId:objectIdSchema,
    userId:objectIdSchema
})

const toggleTopicAllowingFeedbacksSchema=z.object({
    topicId:objectIdSchema,
    allowingFeedbacks:z.boolean()
})

const giveFeeedbackSchema= z
    .object({
        note:noteSchema,
        userId:objectIdSchema
    })

const giveFeedbackInTopicSchema = z.object({
    topicId:objectIdSchema,
    note:noteSchema
})

const updateTopicTitleSchema = z.object({
    topicId:objectIdSchema,
    title:titleSchema
})

const deleteTopicSchema = z.object({
    topicId:objectIdSchema,
    userId:objectIdSchema
})

const deleteFeedbackSchema = z.object({
    userId:objectIdSchema,
    feedbackId:objectIdSchema
})

const deleteFeedbackFromTopicSchema = z.object({
    topicId:objectIdSchema,
    feedbackId:objectIdSchema
})

export {
    usernameSchema,
    emailSchema,
    passwordSchema,
    noteSchema,
    titleSchema,
    objectIdSchema,
    OTPSchema,
    toggleAcceptingFeedbacksSchema,
    signUpSchema,
    loginSchema,
    loginSchema2,
    createTopicSchema,
    getAllFeedbacksOfTopicSchema,
    toggleTopicAllowingFeedbacksSchema,
    giveFeeedbackSchema,
    giveFeedbackInTopicSchema,
    updateTopicTitleSchema,
    deleteTopicSchema,
    deleteFeedbackSchema,
    deleteFeedbackFromTopicSchema
}