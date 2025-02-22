import { Box } from "@mui/material";
import React from "react";
import TodoContent from "./TodoContent";
import BoardTitle from "./boardTitle";
import { useSortable } from "@dnd-kit/sortable";



interface TodoBoardProps {
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

const TodoBoard:React.FC<TodoBoardProps> = ({ category }) => {
    const bgColor = category.color || "#D3D3D3"

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: category.id,
        data: { type: 'column' }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
        border: '1px solid #ccc',
        padding: '8px',
        minWidth: '200px'
    }: undefined;


    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Box sx={{
                backgroundColor: bgColor,
                width: "100%",
                minWidth: "300px",
                flex: "1 1 300px",
                margin: "10px",
                borderRadius: "13px",
                border: "1px solid black",}}>
                <BoardTitle title={category.title} color={bgColor}/>
                <TodoContent category={category}/>
            </Box>
        </div>
    )
}



export default TodoBoard