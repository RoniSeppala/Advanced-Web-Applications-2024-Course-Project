import {Router, Request, Response} from 'express';
import passport from 'passport';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';

const router: Router = Router();

router.post("/local", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}))

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), (req: Request, res: Response) => {
    res.redirect('/');
})

router.get("/twitter", passport.authenticate('twitter'));

router.get("/twitter/callback", passport.authenticate('twitter', { failureRedirect: '/login' }), (req: Request, res: Response) => {
    res.redirect('/');
})

router.get("/logout", (req: Request, res: Response) => {
    req.logout(() => {
        res.redirect('/');
    });
})

router.post("/register", async (req: Request, res: Response) => {


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


export default router;