import mongoose, {Document, Schema} from "mongoose";

interface ITodoBoard extends Document { //interface for todo board
    title: string,
    titleBgColor: string,
    boardBgColor: string,
    usersIDs: string[],
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

const todoBoardSchema: Schema = new Schema({ //schema for todo board
    title: {type: String, required: true},
    titleBgColor: {type: String, required: true},
    boardBgColor: {type: String, required: true},
    usersIDs: [{type: String, required: true}],
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

const TodoBoard: mongoose.Model<ITodoBoard> = mongoose.model<ITodoBoard>("TodoBoard", todoBoardSchema);

export {TodoBoard, ITodoBoard}