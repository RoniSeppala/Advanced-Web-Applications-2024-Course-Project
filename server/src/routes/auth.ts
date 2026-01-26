import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import { registerValidation, loginValidation } from '../middleware/inputvalidation';
import { Result, ValidationError, validationResult } from 'express-validator';

const router: Router = Router();

router.post("/local", loginValidation, (req: Request, res: Response, next: NextFunction) => { //login route for local strategy
    console.log('[auth/local] incoming', {
        hasSession: !!req.session,
        hasPassport: !!(req.session && (req.session as any).passport),
        cookieHeaderPresent: !!req.headers.cookie,
        secure: req.secure,
        forwardedProto: req.headers['x-forwarded-proto']
    });
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) { //return info to client if there were input errors
        res.status(400).json({errors: errors.array()});
        return
    }

    passport.authenticate('local', (err: Error, user: IUser, info: any) => {
        if (err) {
            console.error('[auth/local] authenticate error', err);
            return next(err);
        }
        if (!user) {
            console.warn('[auth/local] invalid credentials', info);
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] }); //return info to client if login failed
        }
        if (!req.session) {
            return next(new Error('Session is not initialized.'));
        }
        (req.session as any).passport = { user: user.id };
        req.session.save((sessionErr) => {
            if (sessionErr) {
                console.error('[auth/local] session save error', sessionErr);
                return next(sessionErr);
            }
            console.log('[auth/local] login ok', {
                sessionID: req.sessionID,
                hasPassport: !!(req.session && (req.session as any).passport)
            });
            return res.status(200).json({ user });
        });
    })(req, res, next);
});

// Google OAuth routes
router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));
router.get("/google/callback", passport.authenticate('google', { failureRedirect: 'https://awa.roniseppala.com/login' }), (req: Request, res: Response) => {
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
        }
        res.redirect('https://awa.roniseppala.com');
    });
})

// X OAuth routes
router.get("/twitter", passport.authenticate('twitter'));
router.get("/twitter/callback", passport.authenticate('twitter', { failureRedirect: 'https://awa.roniseppala.com/login' }), (req: Request, res: Response) => {
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
        }
        res.redirect('https://awa.roniseppala.com');
    });
})

router.get("/logout", (req: Request, res: Response, next: NextFunction) => { //logout route
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.redirect('https://awa.roniseppala.com/');
        });
        return;
    }
    res.clearCookie('connect.sid');
    res.redirect('https://awa.roniseppala.com/');
})

router.post("/register", registerValidation, async (req: Request, res: Response) => { //register route for local strategy

    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) { //return info to client if there were input errors
        res.status(400).json({errors: errors.array()});
        return
    }

    try {
        const existingUser: IUser | null = await User.findOne({email: req.body.email}); //check if user already exists

        if (existingUser) {
            res.status(400).json({errors: [{msg: "User already exists"}]});
            return
        }

        const salt: string = bcrypt.genSaltSync(10); //hash password
        const hash: string = bcrypt.hashSync(req.body.password, salt);

        const newUser: IUser = new User({ //create new user
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin,
            displayName: req.body.displayName

        });

        await newUser.save();

        res.status(200).json(newUser);

    } catch (error: any) {
        console.error('Error in registration,', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
})

router.get("/current_user", (req: Request, res: Response) => { //get current for authentication in frontend
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
})

export default router;
