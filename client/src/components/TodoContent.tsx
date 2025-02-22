import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, List} from "@mui/material";
import React from "react";
import TodoItem from "./TodoItem";

interface TodoContentProps {
    category: {
        id: string,
        title: string,
        color: string,
        todos: {
            id: string,
            todo: string
        }[]
    }
}

const TodoContent:React.FC<TodoContentProps> = ({category}) => {

    return (
        <Box sx={{
            backgroundColor: category.color,
            margin: "10px"}}>
            <List>
                <SortableContext items={category.todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                    {category.todos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} color={category.color} categoryId={category.id}/>
                    ))}
                </SortableContext>
            </List>
        </Box>
    )
}

export default TodoContent