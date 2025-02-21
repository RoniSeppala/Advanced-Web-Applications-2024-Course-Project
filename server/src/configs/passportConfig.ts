import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user: IUser | null = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
    try {
        const user: IUser | null = await User.findOne({email: email});
        if (!user) {
            return done(null, false, {message: 'Incorrect email'});
        }

        if (!bcrypt.compareSync(password, user.password as string)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error:any) {
        return done(error);
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:1234/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user: IUser | null = await User.findOne({googleId: profile.id});
        if (!user) {
            user = new User({
                email: profile.emails ? profile.emails[0].value : undefined,
                googleId: profile.id,
                displayName: profile.displayName
            });
            await user.save();
        }
        return done(null, user);
    } catch (error: any) {
        return done(error, undefined);
    }
}));


passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY as string,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET as string,
    callbackURL: "http://localhost:1234/api/auth/twitter/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        let user: IUser | null = await User.findOne({twitterId: profile.id});
        if (!user) {
            user = new User({
                displayName: profile.username,
                twitterId: profile.id
            });
            await user.save();
        }
        return done(null, user);
    } catch (error: any) {
        return done(error, undefined);
    }
}));