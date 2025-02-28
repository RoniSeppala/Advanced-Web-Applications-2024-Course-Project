import { Box, Button, IconButton, Popover } from "@mui/material";
import React from "react";
import TodoContent from "./TodoContent";
import BoardTitle from "./BoardTitle";
import { useSortable } from "@dnd-kit/sortable";
import DeleteIcon from '@mui/icons-material/Delete';
import { ChromePicker } from 'react-color';

interface TodoCategoryProps {
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
    boardTodoCounter: number,
    setBoardTodoCounter: React.Dispatch<React.SetStateAction<number>>,
    handleTodoDelete: (categoryId: string, todoId: string) => void,
    handleCategoryDelete: (categoryId: string) => void,
    onTodoSave: (content: string, id: string) => void,
    onCategoryTitleSave: (content: string, id: string) => void,
    colorContainerRef: React.RefObject<HTMLDivElement | null>
}

interface Todo {
    id: string,
    todo: string
}

const TodoCategory:React.FC<TodoCategoryProps> = ({ category, boardTodoCounter , setBoardTodoCounter, handleTodoDelete, handleCategoryDelete, onTodoSave, onCategoryTitleSave, colorContainerRef}) => {
    const bgColor = category.color || "#D3D3D3"
    const [chromePickerColor, setChromePickerColor] = React.useState<string>("#D3D3D3")

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

    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: category.id,
        data: { type: 'category' }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: "transform 0.4s ease",
        padding: '8px',
        minWidth: '300px',
        opacity: isDragging ? 0.5 : 1,
        flexGrow: 1,
    };

    const addTodo = () => {
        console.log("Add todo clicked")
        setBoardTodoCounter(boardTodoCounter + 1) //increment the counter to get a new todo id

        const newTodo: Todo = {
            id: `item-${boardTodoCounter}`,
            todo: 'new Todo text ' + boardTodoCounter
        }

        category.todos.push(newTodo)

    }

    const handleColorChange = (newColor: string) => {
        setChromePickerColor(newColor)
        console.log("Color changed to: " + newColor)
        category.color = newColor
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Box sx={{
                backgroundColor: bgColor,
                width: "100%",
                minWidth: "300px",
                borderRadius: "13px",
                border: "1px solid black",
                boxSizing: "border-box" // Ensure padding and border are included in the element's total width and height
                }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "10px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    gap: "10px",
                    }}>
                    <BoardTitle title={category.title} categoryId={category.id} color={bgColor} onCategoryTitleSave={onCategoryTitleSave} onBoardTitleSave={() => {console.log("This is category title, and board title should not be editable here")}}/>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%", // Ensure the container takes the full width
                        justifyContent: "space-between", // Distribute space between categories
                        gap: "10px" // Add gap between categories
                    }}>
                        <Button sx={{
                            margin: "10px",
                            background: "lightblue",
                            borderRadius: "10px",
                            color: "black",
                            border: "1px solid black",
                            width: "calc(30% - 5px)"
                            }} onClick={addTodo}>Add Todo</Button>
                        <IconButton aria-label="delete" size="small" onClick={() => {handleCategoryDelete(category.id)}} sx={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            padding: "20px",
                            background: "lightblue",
                            borderRadius: "10px",
                            color: "black",
                            border: "1px solid black",
                            width: "calc(33% - 5px)"
                            }}>
                        <DeleteIcon />
                        </IconButton>
                        <Button
                            aria-describedby={id}
                            sx={{
                                margin: "10px",
                                background: "lightblue",
                                borderRadius: "10px",
                                color: "black",
                                border: "1px solid black",
                                width: "calc(30% - 5px)"
                            }}
                            onClick={handlePopoverClick}
                            >
                            Change Color
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}>
                            <div ref={colorContainerRef}
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
                    </Box>
                </Box>
                <TodoContent category={category} handleTodoDelete={handleTodoDelete} onTodoSave={(content:string, id:string) => {onTodoSave(content, id)}} colorContainerRef={colorContainerRef}/>
            </Box>
        </div>
    )
}

export default TodoCategory