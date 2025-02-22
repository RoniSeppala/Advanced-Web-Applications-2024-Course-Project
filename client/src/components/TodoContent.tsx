import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, List, darken } from "@mui/material";
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
    handleTodoDelete: (categoryId: string, todoId: string) => void
}

const TodoContent: React.FC<TodoContentProps> = ({ category, handleTodoDelete }) => {
    const isEmpty = category.todos.length === 0;

    // Ensure todos is an array with valid items only.
    const validTodos = Array.isArray(category.todos)
        ? category.todos.filter(todo => todo && todo.id)
        : [];
    const placeholderId = `placeholder-${category.id}`;

    let placeholderElement = null;
    if(isEmpty) {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
            id: placeholderId,
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
        placeholderElement = (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                No todos available
            </div>
        );
    }

    return (
        <Box sx={{ backgroundColor: category.color, margin: "10px" }}>
            <List>
                <SortableContext 
                    items={
                        isEmpty 
                          ? [placeholderId]
                          : validTodos.map(todo => todo.id)
                    } 
                    strategy={verticalListSortingStrategy}
                >
                    {isEmpty ? (
                        placeholderElement
                    ) : (
                        validTodos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} color={category.color} categoryId={category.id} handleTodoDelete={handleTodoDelete}/>
                        ))
                    )}
                </SortableContext>
            </List>
        </Box>
    )
}

export default TodoContent;