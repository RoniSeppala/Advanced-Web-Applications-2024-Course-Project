import React from "react";
import TodoCategory from "./TodoCategory";
import { Box } from "@mui/material";
import BoardTitle from "./boardTitle";



const TodoBoard:React.FC = () => {
    return (
        <Box sx={{paddingTop: "10px"}}>
        <BoardTitle title="Todo Board" color="#D3D3D3" bigTitle={true}/>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
                }}>
                <TodoCategory boardName="todo" color="#ADD8E6"/>
                <TodoCategory boardName="important" color="#FF0000"/>
                <TodoCategory boardName="testing"/>
                <TodoCategory boardName="finished"/>
            </Box>
        </Box>
    )
}

export default TodoBoard