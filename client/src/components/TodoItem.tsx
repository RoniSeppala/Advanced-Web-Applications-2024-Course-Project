import { useSortable } from "@dnd-kit/sortable";
import { darken, IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";

interface TodoItemProps {
    color: string,
    categoryId: string,
    todo: {
        id: string,
        todo: string
    },
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

const TodoItem:React.FC<TodoItemProps> = ({todo, color, categoryId, category}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: todo.id,
        data: { type: 'todo', categoryId }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: "transform 0.4s ease",
        padding: '8px',
        minWidth: '200px',
        backgroundColor: isDragging ? darken(color, 0.2) : color,
        opacity: isDragging ? 0.5 : 1,
    };

    const deleteTodo = () => {
        console.log("Delete todo clicked")
        console.log("Todo id: ", todo.id)
        console.log(category)
        category.todos = category.todos.filter((item) => item.id !== todo.id)
        console.log(category)
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ListItem key={todo.id} sx={{
                borderRadius: "5px",
                margin: "10px auto",
                padding: "5px",
                paddingLeft: "10px",
                paddingRight: "10px",
                color: "black",
                border: "1px solid black",
                backgroundColor: darken(color, 0.05),
            }}>
                <ListItemText primary={todo.todo}/>
                <IconButton aria-label="delete" size="small" onClick={deleteTodo}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        </div>
    )
}

export default TodoItem;