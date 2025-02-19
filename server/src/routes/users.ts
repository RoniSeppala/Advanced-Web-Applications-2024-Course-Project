import {Router, Request, Response} from 'express';

const router: Router = Router();


router.post("/register", (req: Request, res: Response) => {
    res.send("Register");
});

router.post("/login", (req: Request, res: Response) => {
    res.send("Login");
});

export default router;