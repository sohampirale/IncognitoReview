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
 * giveFeedback
 * giveFeedback
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
    title:titleSchema,
    userId:objectIdSchema
})

const giveFeeedbackSchema= z
    .object({
        note:noteSchema,
        topicId:objectIdSchema.optional(),
        userId:objectIdSchema.optional()
    })
    .refine((data)=>data.topicId||data.userId,"Atleast topicId or userId is necessary")

const deleteTopicSchema = z.object({
    topicId:objectIdSchema,
    userId:objectIdSchema
})

const deleteFeedbackSchema = z.object({
    topicId:objectIdSchema.optional(),
    userId:objectIdSchema,
    feedbackId:objectIdSchema
})

export {
    usernameSchema,
    emailSchema,
    passwordSchema,
    noteSchema,
    titleSchema,
    objectIdSchema,
    signUpSchema,
    loginSchema,
    loginSchema2,
    createTopicSchema,
    giveFeeedbackSchema,
    deleteTopicSchema,
    deleteFeedbackSchema
}