import { Box } from "@mui/material";
import React from "react";
import TodoContent from "./TodoContent";
import BoardTitle from "./boardTitle";


interface TodoBoardProps {
    boardCategoryName?: string,
    color?: string,
    todoList?: {id: number, todo: string}[]
}

const TodoBoard:React.FC<TodoBoardProps> = ({boardCategoryName, color, todoList}) => {
    const bgColor = color || "#D3D3D3"

    return (
        <>
        <Box sx={{
            backgroundColor: bgColor,
            width: "100%",
            margin: "10px",
            borderRadius: "13px",
            border: "1px solid black",}}>
            <BoardTitle title={boardCategoryName} color={bgColor}/>
            <TodoContent color={bgColor} todoList={todoList}/>
        </Box>
        </>
    )
}



export default TodoBoard