import React from "react";
import TodoCategory from "./TodoCategory";
import { Box } from "@mui/material";
import BoardTitle from "./boardTitle";


interface TodoBoardProps {
    todoBoardData?: {
        title: string,
        categories: {
            title: string,
            color: string,
            todos: string[]
        }[]
    }

}

const TodoBoard:React.FC<TodoBoardProps> = ({
    todoBoardData = {
        title: "No title input",
        categories: [{
            title: "No category title input",
            color: "#D3D3D3",
            todos: ["No todo input"]
        }]
    }
}) => {
    return (
        <Box sx={{
            paddingTop: "10px",
            backgroundColor: "#f0f0f0",
            maxWidth: "90vw",
            margin: "auto",
            marginBottom: "30px",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid black",}}>
        <BoardTitle title={todoBoardData.title} color="#D3D3D3" bigTitle={true}/>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
                }}>
                {todoBoardData.categories.map((category, index) => {
                    return <TodoCategory key={index} boardCategoryName={category.title} color={category.color} todoList={category.todos}/>
                })}
            </Box>
        </Box>
    )
}

export default TodoBoard