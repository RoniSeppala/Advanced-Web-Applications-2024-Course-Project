import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import { registerValidation, loginValidation } from '../middleware/inputvalidation';
import { Result, ValidationError, validationResult } from 'express-validator';

const router: Router = Router();

router.post("/local", loginValidation, (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) { //return info to client if there were input errors
        console.log(errors.array());
        res.status(400).json({errors: errors.array()});
        return
    }

    passport.authenticate('local', (err: Error, user: IUser, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ user });
        });
    })(req, res, next);
});

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

router.get("/google/callback", passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }), (req: Request, res: Response) => {
    res.redirect('http://localhost:3000');
})

router.get("/twitter", passport.authenticate('twitter'));

router.get("/twitter/callback", passport.authenticate('twitter', { failureRedirect: '/login' }), (req: Request, res: Response) => {
    res.redirect('http://localhost:3000');
})

router.get("/logout", (req: Request, res: Response) => {
    req.logout(() => {
        res.redirect('/');
    });
})

router.post("/register", registerValidation, async (req: Request, res: Response) => {

    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) { //return info to client if there were input errors
        res.status(400).json({errors: errors.array()});
        return
    }

    try {
        const existingUser = await User.findOne({email: req.body.email});

        if (existingUser) {
            res.status(400).json({errors: [{msg: "User already exists"}]});
            return
        }

        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(req.body.password, salt);

        const newUser: IUser = new User({
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

router.get("/current_user", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
})

export default router;