import { Router, Request, Response} from 'express';
import { TodoBoard, ITodoBoard } from '../models/TodoBoard';

const router: Router = Router();

router.get("/getboards", async (req: Request, res: Response) => { //get all boards for user
    let todoBoards: ITodoBoard[] = [];

    if (req.isAuthenticated()) { //if user is authenticated, get all boards for user
        todoBoards = await TodoBoard.find({ usersIDs: { $in: [(req.user as any)._id] } });

        res.status(200).json({todoBoards: todoBoards});
        return
    } else {
        res.status(401).json({ error: "Not authenticated" });
        return
    }
})

router.post("/createboard", async (req: Request, res: Response) => { //create a new board
    let todoBoards: ITodoBoard[] = [];

    if (!req.isAuthenticated()) { //if user is not authenticated, return error
        res.status(401).json({ error: "Not authenticated" });
        return
    }

    const newBoard: ITodoBoard = req.body;

    try {
        const todoBoard: ITodoBoard = new TodoBoard(newBoard);

        await todoBoard.save() //save new board to database
        todoBoards = await TodoBoard.find({ usersIDs: { $in: [(req.user as any)._id] } }); //get all boards for user

        res.status(201).json({todoBoards: todoBoards}); //return all boards for user after new board is created for updateing client
        return

    } catch (error: any) {
        res.status(400).json({ error: error.message });
        return
    }
})

router.post("/deleteboard", (req: Request, res: Response) => { //currently unused delete a board
    console.log("deleteBoard")
    res.status(200).json({message: "deleteBoard"})
})

router.post("/updateboard", async (req: Request, res: Response) => {
    let todoBoard: ITodoBoard | null = null;

    if (!req.isAuthenticated()) { //if user is not authenticated, return error
        res.status(401).json({ error: "Not authenticated" });
        return
    }

    const newBoard: ITodoBoard = req.body.todoBoard;
    
    try {
        await TodoBoard.updateOne({ _id: newBoard._id }, newBoard); //update board in database

        todoBoard = await TodoBoard.findOne({ _id: newBoard._id }); //get updated board from database for returning to client an updated version
        res.status(200).json({ message: "Boards updated successfully", todoBoard: todoBoard });
        return
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ error: error.message });
        return;
    } 
})

export default router;