import mongoose from "mongoose";
import { } from 'dotenv/config'

export const connectToDataBase = () => {
    mongoose.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('database connected....')
    }).catch(err => console.log(err))
} 