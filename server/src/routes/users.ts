import {Router, Request, Response} from 'express';
import { registerValidation, loginValidation } from '../middleware/inputvalidation';
import { Result, ValidationError, validationResult } from 'express-validator';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const router: Router = Router();


router.post("/register", registerValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) { //return info to client if there were input errors
        res.status(400).json({errors: errors.array()});
        return
    }

    try { //user registering
        const existingUser = await User.findOne({email: req.body.email}); //check if user already exists and inform client if did
        
        if (existingUser) {
            res.status(400).json({errors: [{msg: "User already exists"}]});
            return
        }
        

        //password handling and new user creation
        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(req.body.password, salt);

        const newUser: IUser = new User({
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin
        });

        await newUser.save();

        res.status(200).json(newUser);
    } catch (error: any) { //error handling
        console.error('Error in registration,', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
});

router.post("/login", loginValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) { //return info to client if there were input errors
        console.log(errors.array());
        res.status(400).json({errors: errors.array()});
        return
    }

    try {
        const user: IUser | null = await User.findOne({email: req.body.email});

        if (!user) {
            res.status(404).json({errors: [{msg: "Login failed"}]});
            return
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(401).json({errors: [{msg: "Login failed"}]});
            return
        }

        const payload: JwtPayload = {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }
        
        const token: string = jwt.sign(payload, process.env.TOKEN_SECRET as string);

        res.status(200).json({token: token});
        return


    } catch (error: any) {//error handling
        console.error('Error in registration,', error)
        res.status(500).json({error: 'Internal server error'})
        return
        
    }

});

export default router;