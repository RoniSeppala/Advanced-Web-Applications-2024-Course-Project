import {Router, Request, Response} from 'express';
import { registerValidation, loginValidation } from '../middleware/inputvalidation';
import { Result, ValidationError, validationResult } from 'express-validator';

const router: Router = Router();


router.post("/register", registerValidation, (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return
    }

    console.log(req.body);
    res.json({message: "Register"});
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