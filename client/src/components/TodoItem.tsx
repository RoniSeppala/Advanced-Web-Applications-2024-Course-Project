import { useSortable } from "@dnd-kit/sortable";
import { Button, darken, IconButton, ListItem, ListItemText, Popover } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import EdiatableTextDisplay from "./EditableTextDisplay";
import { Palette } from "@mui/icons-material";
import { ChromePicker } from "react-color";

interface TodoItemProps {
    category: {
        id: string,
        title: string,
        color: string,
        todos: {
            id: string,
            todo: string,
            color?: string
        }[]
    },
    todo: {
        id: string,
        todo: string,
        color?: string
    },
    handleTodoDelete: (categoryId: string, todoId: string) => void,
    onTodoSave: (content: string, id: string) => void,
    colorContainerRef: React.RefObject<HTMLDivElement | null>
}

const TodoItem:React.FC<TodoItemProps> = ({category, todo, handleTodoDelete, onTodoSave, colorContainerRef}) => {

    // Setup for todo sorting drag and drop
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: todo.id,
        data: { type: 'todo', categoryId: category.id }
    });

    const [chromePickerColor, setChromePickerColor] = React.useState<string>(todo.color || category.color)

    //popover setup
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open: boolean = Boolean(anchorEl);
    const id: string | undefined = open ? 'simple-popover' : undefined;

    const handleColorChange = (newColor: string) => { //change color of the todo
        setChromePickerColor(newColor)
        console.log("Color changed to: " + newColor)
        category.todos.forEach((item) => {
            if(item.id === todo.id) {
                item.color = newColor
            }
        })
    }

    const style = { //dragging style for todos
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: "transform 0.4s ease",
        padding: '8px',
        minWidth: '200px',
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
                backgroundColor: darken(chromePickerColor, 0.05),
            }}>
                <ListItemText primary={<EdiatableTextDisplay initialContent={todo.todo} id={todo.id} onSave={(content:string, id:string) => {onTodoSave(content, id)}}/>}/>
                <IconButton aria-label="delete" size="small" onClick={() => handleTodoDelete(category.id, todo.id)}>
                    <DeleteIcon />
                </IconButton>
                <IconButton aria-label="drag" size="small" onClick={handlePopoverClick}>
                    <Palette />
                </IconButton>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}>
                    <div
                        ref={colorContainerRef}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDrag={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        style={{
                            pointerEvents: 'auto',
                            zIndex: 1000
                            }}>
                        <ChromePicker disableAlpha color={chromePickerColor} onChange={(newColor) => {handleColorChange(newColor.hex)}}/>
                        <Button onClick={handlePopoverClose}
                        sx={{
                            backgroundColor: "lightblue",
                            color: "black",
                            borderRadius: "5px",
                            border: "1px solid black",
                            marginLeft: "auto",
                            width: "100%"

                        }}>Close</Button>
                    </div>
                </Popover>
            </ListItem>
        </div>
    )
}

export default TodoItem;