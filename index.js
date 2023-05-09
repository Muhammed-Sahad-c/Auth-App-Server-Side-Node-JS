import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import { } from 'dotenv/config'
import { connectToDataBase } from './config/connection.js'
import { router as userRouter } from './routes/userRouter.js'

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRouter)

app.listen(process.env.PORT, () => {
    console.log(`server Started...`)
    console.log(`running on Port ${process.env.PORT}..`)
})

connectToDataBase();

