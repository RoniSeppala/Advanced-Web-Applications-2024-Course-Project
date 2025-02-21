import React from "react";
import TodoCategory from "./TodoCategory";
import { Box } from "@mui/material";



const TodoBoard:React.FC = () => {
    return (
        <div>
        <h1>Todo Board</h1>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
                }}>
                <TodoCategory board="todo"/>
                <TodoCategory board="important"/>
                <TodoCategory board="testing"/>
                <TodoCategory board="finished"/>
            </Box>
        </div>
    )
}

export default TodoBoard