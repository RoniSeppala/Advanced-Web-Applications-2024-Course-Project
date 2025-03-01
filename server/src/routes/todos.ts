import { Router, Request, Response} from 'express';
import { TodoBoard, ITodoBoard } from '../models/TodoBoard';

const router: Router = Router();

router.get("/getboards", async (req: Request, res: Response) => {
    let todoBoards: ITodoBoard[] = [];
    if (req.isAuthenticated()) {
        todoBoards = await TodoBoard.find({ usersIDs: { $in: [(req.user as any)._id] } });
    }

    res.status(200).json({todoBoards: todoBoards});
})

router.post("/createboard", async (req: Request, res: Response) => {
    let todoBoards: ITodoBoard[] = [];

    if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Not authenticated" });
        return
    }

    const newBoard: ITodoBoard = req.body;

    try {
        const todoBoard = new TodoBoard(newBoard);
        console.log(todoBoard)

        await todoBoard.save()
        todoBoards = await TodoBoard.find({ usersIDs: { $in: [(req.user as any)._id] } });

        res.status(201).json({todoBoards: todoBoards});
        return

    } catch (error: any) {
        res.status(400).json({ error: error.message });
        return
    }
})

router.post("/deleteboard", (req: Request, res: Response) => {
    console.log("deleteBoard")
    res.status(200).json({message: "deleteBoard"})
})

router.post("/updateboard", async (req: Request, res: Response) => {
    let todoBoard: ITodoBoard | null = null;
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Not authenticated" });
        return
    }

    const newBoard = req.body.todoBoard;
    
    try {
        await TodoBoard.updateOne({ _id: newBoard._id }, newBoard);

        todoBoard = await TodoBoard.findOne({ _id: newBoard._id });
        res.status(200).json({ message: "Boards updated successfully", todoBoard: todoBoard });
        return
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ error: error.message });
        return;
    } 
})

export default router;