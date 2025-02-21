import { Box } from "@mui/material";
import React from "react";
import TodoContent from "./TodoContent";


interface TodoBoardProps {
    board: string
}

const TodoBoard:React.FC<TodoBoardProps> = ({board}) => {
    return (
        <>
        <Box sx={{
            backgroundColor: "darkgray",
            margin: "10px",}}>
            <h1>i am a {board}</h1>
            <TodoContent/>
        </Box>
        </>
    )
}



export default TodoBoard