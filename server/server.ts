import express, {Express} from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose, {Connection} from 'mongoose';
import users from "./src/routes/users";
import cors, {CorsOptions} from 'cors';


dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 1234;

const mongoDB: string = process.env.MONGODB_URI as string || "mongodb://localhost:27017/test";
mongoose.connect(mongoDB)
mongoose.Promise = Promise;
const db: Connection = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(morgan('dev'));
app.use(express.json());
app.use("/api/users", users);

if (process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});