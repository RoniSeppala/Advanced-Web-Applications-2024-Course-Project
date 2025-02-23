import { useSortable } from "@dnd-kit/sortable";
import { darken, IconButton, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import EdiatableTextDisplay from "./EditableTextDisplay";

interface TodoItemProps {
    color: string,
    categoryId: string,
    todo: {
        id: string,
        todo: string
    },
    handleTodoDelete: (categoryId: string, todoId: string) => void,
    onTodoSave: (content: string, id: string) => void
}

const TodoItem:React.FC<TodoItemProps> = ({todo, color, categoryId, handleTodoDelete, onTodoSave}) => {
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
                <ListItemText primary={<EdiatableTextDisplay initialContent={todo.todo} id={todo.id} onSave={(content:string, id:string) => {onTodoSave(content, id)}}/>}/>  {/*TODO: add proper onSave function */}
                <IconButton aria-label="delete" size="small" onClick={() => handleTodoDelete(categoryId, todo.id)}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        </div>
    )
}

export default TodoItem;