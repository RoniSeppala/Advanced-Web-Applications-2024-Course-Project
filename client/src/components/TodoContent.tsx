import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, darken, List } from "@mui/material";
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
    },
    categoryAmmount: number
}

const TodoContent:React.FC<TodoContentProps> = ({category, categoryAmmount}) => {

    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
            id: "empty-category-" + categoryAmmount,
            data: { type: 'todo', categoryId: category.id }
    });

    const style = {
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            transition: "transform 0.4s ease",
            padding: '8px',
            minWidth: '200px',
            backgroundColor: isDragging ? darken(category.color, 0.2) : category.color,
            opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Box sx={{
            backgroundColor: category.color,
            margin: "10px"}}>
            <List>
                <SortableContext items={(category.todos).map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                    {category.todos.length > 0 ? (
                        category.todos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} color={category.color} categoryId={category.id}/>
                        ))
                    ) : (
                        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                            No todos available
                        </div>
                    )}
                </SortableContext>
            </List>
        </Box>
    )
}

export default TodoContent;