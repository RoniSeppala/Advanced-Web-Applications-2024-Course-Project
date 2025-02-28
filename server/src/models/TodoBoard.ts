import mongoose, {Document, Schema} from "mongoose";
import { IUser } from "./User";

interface ITodoBoard extends Document {
    title: string,
    titleBgColor: string,
    boardBgColor: string,
    users: IUser[],
    categories: {
        id: string,
        title: string,
        color: string,
        todos: {
            id: string,
            todo: string,
            color?: string
        }[]
    }[]
}

const todoBoardSchema: Schema = new Schema({
    title: {type: String, required: true},
    titleBgColor: {type: String, required: true},
    boardBgColor: {type: String, required: true},
    users: [{type: Schema.Types.ObjectId, ref: "User"}],
    categories: [{
        id: {type: String, required: true},
        title: {type: String, required: true},
        color: {type: String, required: true},
        todos: [{
            id: {type: String, required: true},
            todo: {type: String, required: true},
            color: {type: String, required: false}
        }]
    }]

});

const TodoBoard: mongoose.Model<ITodoBoard> = mongoose.model<ITodoBoard>("User", todoBoardSchema);

export {TodoBoard, ITodoBoard}