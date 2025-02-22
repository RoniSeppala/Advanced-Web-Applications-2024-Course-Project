import { Box } from "@mui/material";
import React from "react";
import TodoContent from "./TodoContent";
import BoardTitle from "./boardTitle";


interface TodoBoardProps {
    boardName?: string,
    color?: string,
}

const TodoBoard:React.FC<TodoBoardProps> = ({boardName: boardName, color}) => {
    const bgColor = color || "#D3D3D3"

    return (
        <>
        <Box sx={{
            backgroundColor: bgColor,
            width: "100%",
            margin: "10px",
            borderRadius: "13px",
            border: "1px solid black",}}>
            <BoardTitle title={boardName} color={bgColor}/>
            <TodoContent/>
        </Box>
        </>
    )
}



export default TodoBoard