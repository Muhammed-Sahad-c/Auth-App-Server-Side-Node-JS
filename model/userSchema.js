
import mongoose, { Schema } from 'mongoose'

const usersSchema = new Schema({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    image: { type: String }
})


export const userModel = mongoose.model('UserData', usersSchema);   