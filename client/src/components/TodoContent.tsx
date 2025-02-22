import { Box, List, ListItem, ListItemText } from "@mui/material";
import { darken } from "@mui/material/styles";
import React from "react";

interface TodoContentProps {
    color?: string
    todoList?: {id: number, todo: string}[]
}

const TodoContent:React.FC<TodoContentProps> = ({color = "#D3D3D3", todoList = [{id: 1, todo:"got no valid input"}]}) => {

    return (
        <Box sx={{
            backgroundColor: {color},
            margin: "10px"}}>
            <List>
                {todoList.map((todo) => (
                    <ListItem key={todo.id} sx={{
                        border: "1px solid black",
                        borderRadius: "5px",
                        margin: "10px auto",
                        padding: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        color: "black",
                        backgroundColor: darken(color, 0.05),
                    }}>
                        <ListItemText primary={todo.todo}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default TodoContent