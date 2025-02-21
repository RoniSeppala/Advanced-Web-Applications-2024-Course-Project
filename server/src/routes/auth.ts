import {Router, Request, Response} from 'express';
import passport from 'passport';

const router: Router = Router();

router.post("/local", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}))

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), (req: Request, res: Response) => {
    res.redirect('/');
})

router.get("/facebook", passport.authenticate('facebook', {scope: ['email']}));

router.get("/facebook/callback", passport.authenticate('facebook', { failureRedirect: '/login' }), (req: Request, res: Response) => {
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



export default router;