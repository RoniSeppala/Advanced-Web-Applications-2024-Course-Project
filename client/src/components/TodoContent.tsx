import { Box } from "@mui/material";
import React from "react";



const TodoContent:React.FC = () => {
    return (
        <Box sx={{
            backgroundColor: "lightgray",
            margin: "10px"}}>
            <ul>
                <li>Todo 1</li>
                <li>Todo 2</li>
                <li>Todo 3</li>
            </ul>
        </Box>
    )
}

export default TodoContent