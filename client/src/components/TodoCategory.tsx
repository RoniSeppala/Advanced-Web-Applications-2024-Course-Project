import { Box } from "@mui/material";
import React from "react";
import TodoContent from "./TodoContent";
import BoardTitle from "./BoardTitle";
import { useSortable } from "@dnd-kit/sortable";

interface TodoCategoryProps {
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

const TodoCategory:React.FC<TodoCategoryProps> = ({ category }) => {
    const bgColor = category.color || "#D3D3D3"

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: category.id,
        data: { type: 'category' }
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        padding: '8px',
        minWidth: '300px',
        opacity: isDragging ? 0.5 : 1,
        flexGrow: 1,
        flexBasis: "calc(33.33% - 10px)"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Box sx={{
                backgroundColor: bgColor,
                width: "100%",
                minWidth: "300px",
                flex: "1 1 calc(33.33% - 10px)", // Ensure the category takes up a third of the available space
                borderRadius: "13px",
                border: "1px solid black",
                boxSizing: "border-box" // Ensure padding and border are included in the element's total width and height
                }}>
                <BoardTitle title={category.title} color={bgColor}/>
                <TodoContent category={category}/>
            </Box>
        </div>
    )
}

export default TodoCategory