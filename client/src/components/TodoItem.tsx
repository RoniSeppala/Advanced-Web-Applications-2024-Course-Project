import { useSortable } from "@dnd-kit/sortable";
import { darken, IconButton, ListItem, ListItemText, Popover } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import EdiatableTextDisplay from "./EditableTextDisplay";
import { Palette } from "@mui/icons-material";
import { ChromePicker } from "react-color";

interface TodoItemProps {
    color: string,
    categoryId: string,
    todo: {
        id: string,
        todo: string
    },
    handleTodoDelete: (categoryId: string, todoId: string) => void,
    onTodoSave: (content: string, id: string) => void,
    colorContainerRef: React.RefObject<HTMLDivElement | null>
}

const TodoItem:React.FC<TodoItemProps> = ({todo, color, categoryId, handleTodoDelete, onTodoSave, colorContainerRef}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: todo.id,
        data: { type: 'todo', categoryId }
    });

    const [chromePickerColor, setChromePickerColor] = React.useState<string>(color)

    //popover setup
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Change color clicked")
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleColorChange = (newColor: string) => {
        setChromePickerColor(newColor)
        console.log("Color changed to: " + newColor)
    }

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
                    </div>
                </Popover>
            </ListItem>
        </div>
    )
}

export default TodoItem;