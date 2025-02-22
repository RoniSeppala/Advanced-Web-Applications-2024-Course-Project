import { useSortable } from "@dnd-kit/sortable";
import { darken, ListItem, ListItemText } from "@mui/material";
import React from "react";

interface TodoItemProps {
    color: string,
    categoryId: string,
    todo: {
        id: string,
        todo: string
    }
}

const TodoItem:React.FC<TodoItemProps> = ({todo, color, categoryId}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: todo.id,
        data: { type: 'todo', categoryId }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        border: '1px solid #ccc',
        padding: '8px',
        minWidth: '200px',
        backgroundColor: isDragging ? darken(color, 0.2) : color,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
        </div>
    )
}

export default TodoItem;