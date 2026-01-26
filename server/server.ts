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
import MongoStore from 'connect-mongo';

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
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_SESSION_URI as string || "mongodb://localhost:27017/sessions",
        collectionName: 'sessions',
        ttl: 60 * 60
    }),
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

// error handler for debugging
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[error]', {
        message: err?.message,
        stack: err?.stack,
        url: req.originalUrl
    });
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'Internal server error' });
});

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
