import {Router, Request, Response} from 'express';
import { registerValidation, loginValidation } from '../middleware/inputvalidation';
import { Result, ValidationError, validationResult } from 'express-validator';
import { User, IUser } from '../models/User';

const router: Router = Router();


router.post("/register", registerValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return
    }

    try {
        const existingUser = await User.findOne({email: req.body.email});
        
        if (existingUser) {
            res.status(400).json({error: 'User already exists'});
            return
        }
        
    } catch (error: any) {
        console.error('Error in registration,', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
});

router.post("/login", loginValidation, (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        res.status(400).json({errors: errors.array()});
        return
    }

    console.log(req.body);
    res.json({message:"Login"});
});

export default router;