import express, {Express} from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose, {Connection} from 'mongoose';
import cors, {CorsOptions} from 'cors';
import session from 'express-session';
import passport from 'passport';
dotenv.config();
import "./src/configs/passportConfig";
import auth from "./src/routes/auth";
import todos from "./src/routes/todos";

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 1234;

const mongoDB: string = process.env.MONGODB_URI as string || "mongodb://localhost:27017/test";
mongoose.connect(mongoDB)
mongoose.Promise = Promise;
const db: Connection = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true)

app.use(session({
    secret: process.env.SESSION_SECRET as string || "secret-string",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", auth);
app.use("/api/todos", todos)

if (process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
}

app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});