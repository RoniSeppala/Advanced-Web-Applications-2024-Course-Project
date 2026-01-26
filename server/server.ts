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

const mongoDB: string = process.env.MONGODB_URI as string || "mongodb://localhost:27017/test"; //connect to local mongodb
mongoose.connect(mongoDB)
mongoose.Promise = Promise; 
const db: Connection = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1)

// set up cors
if (process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        credentials: true,
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
} else {
    const corsOptions: CorsOptions = {
        origin: 'https://awa.roniseppala.com',
        credentials: true,
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
}

const useSecureCookies = process.env.NODE_ENV === 'production' || process.env.FORCE_HTTPS === 'true';

app.use(session({ //initialize session for passport
    secret: process.env.SESSION_SECRET as string || "secret-string",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { 
        secure: useSecureCookies, 
        maxAge: 1000 * 60 * 60,
        sameSite: useSecureCookies ? 'none' : 'lax',
        httpOnly: true
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/api/auth", auth);
app.use("/api/todos", todos)

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
