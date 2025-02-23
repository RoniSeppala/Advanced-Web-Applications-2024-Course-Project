import React from "react";
import TodoCategory from "./TodoCategory";
import { Box, Button } from "@mui/material";
import BoardTitle from "./BoardTitle";
import { DndContext, DragOverlay, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

interface TodoBoardProps {
    todoBoardData: {
        title: string,
        titleBgColor: string,
        boardBgColor: string,
        categories: {
            id: string,
            title: string,
            color: string,
            todos: {
                id: string,
                todo: string
            }[]
        }[]
    }

}

interface TodoBoardDataInterface {
    title: string,
        titleBgColor: string,
        boardBgColor: string,
        categories: {
            id: string,
            title: string,
            color: string,
            todos: {
                id: string,
                todo: string
            }[]
        }[]
}

interface Category {
    id: string,
    title: string,
    color: string,
    todos: {
        id: string,
        todo: string
    }[]
}

const TodoBoard:React.FC<TodoBoardProps> = ({
    todoBoardData = { //placeholder data if no data is passed
        title: "No title input",
        titleBgColor: "#C9C9FF",
        boardBgColor: "#FFDAC1",
        categories: [{
            title: "No category title input",
            color: "#D3D3D3",
            id: "category-0",
            todos: [{
                id: "item-0",
                todo: "No todo input"
            }]
        }]
    }
}) => {
    const initialCategoryOrder = todoBoardData.categories.map((category) => category.id)
    const [todoBoardDataState, setTodoBoardDataState] = React.useState<TodoBoardDataInterface>(todoBoardData)
    const [categoryOrder, setCategoryOrder] = React.useState<string[]>(initialCategoryOrder)
    const [categories, setCategories] = React.useState<Category[]>(todoBoardDataState.categories)
    const [activeItem, setActiveItem] = React.useState<{ id?: string, content?: string, color?: string, type: string } | null>(null)
    const [boardTodoCounter, setBoardTodoCounter] = React.useState<number>(0)
    const [boardCategoryCounter, setBoardCategoryCounter] = React.useState<number>(0)

    //count initial todos
    React.useEffect(() => {
        const count = categories.reduce((acc, category) => acc + category.todos.length, 0)
        if (count > boardTodoCounter) {
            setBoardTodoCounter(count + 1)
        }
    }, [])

    //count initial categories
    React.useEffect(() => {
        const count = categories.length
        if (count > boardCategoryCounter) {
            setBoardCategoryCounter(count + 1)
        }
    }, [])

    const addCategory = () => {
        setBoardCategoryCounter(boardCategoryCounter + 1)
        console.log("Add category clicked")
        const newCategory: Category = {
            id: `category-${boardCategoryCounter}`,
            title: "New Category " + boardCategoryCounter,
            color: "#D3D3D3",
            todos: []
        }
        console.log(newCategory)
        setTodoBoardDataState((prevData) => {
            const newCategories = [...prevData.categories, newCategory]
            return { ...prevData, categories: newCategories }
        })
        setCategories((prevCategories) => [...prevCategories, newCategory])
        setCategoryOrder((prevOrder) => [...prevOrder, newCategory.id])
    }

    const sensors = useSensors(
        useSensor(PointerSensor,{ activationConstraint: { distance: 8} })
    )

    const handleDragStart = (event: any) => {
        const { active } = event;
        const { type, categoryId } = active.data.current;
        const activeItemCategory = categories.find((category) => category.id === categoryId);
        if (!activeItemCategory) return;

        if (type === "todo") {
            const item = activeItemCategory.todos.find((todo) => todo.id === active.id);
            if (item) {
                setActiveItem({ id: item.id, content: item.todo , color: activeItemCategory.color, type: type });
            }
        } else {
            setActiveItem({type: type });
        }
        
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) {
            return;
        }
        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === "category" && overType === "category") {  //category drag
            if (active.id !== over.id) {
                const oldIndex = categoryOrder.indexOf(active.id);
                const newIndex = categoryOrder.indexOf(over.id);
                setCategoryOrder((prevOrder) => arrayMove(prevOrder, oldIndex, newIndex));
                setCategories((prevCategories) => {
                    const newCategories = arrayMove(prevCategories, oldIndex, newIndex);
                    return newCategories;
                });
            }
        }

        if (activeType === "todo" && overType === "todo") {  //todo drag
            const activeCategoryId = active.data.current.categoryId;
            const overCategoryId = over.data.current.categoryId;

            //drop within category
            if (activeCategoryId === overCategoryId) {
                const category = categories.find((category) => category.id === activeCategoryId);
                if (!category) return;
                const categoryItems = category.todos;
                const oldIndex = categoryItems?.findIndex((item) => item.id === active.id);
                const newIndex = categoryItems?.findIndex((item) => item.id === over.id);
                setCategories((prevCategories) =>
                    prevCategories.map((cat) =>
                        cat.id === activeCategoryId ? { ...cat, todos: arrayMove(categoryItems, oldIndex, newIndex) } : cat
                    )
                );
            } else { //drop between categories
                const sourceCategory = categories.find((category) => category.id === activeCategoryId);
                if (!sourceCategory) return;
                const sourceItems = Array.from(sourceCategory.todos);

                const destinationCategory = categories.find((category) => category.id === overCategoryId);
                if (!destinationCategory) return;
                const destItems = Array.from(destinationCategory.todos);

                const sourceIndex = sourceItems.findIndex((item) => item.id === active.id);
                const [movedItem] = sourceItems.splice(sourceIndex, 1);
                const destIndex = destItems.findIndex((item) => item.id === over.id);

                if (destIndex === -1) {
                    destItems.push(movedItem);
                } else {
                    destItems.splice(destIndex, 0, movedItem);
                }

                setCategories((prevCategories) =>
                    prevCategories.map((cat) => {
                        if (cat.id === activeCategoryId) {
                            return { ...cat, todos: sourceItems };
                        }
                        if (cat.id === overCategoryId) {
                            return { ...cat, todos: destItems };
                        }
                        return cat;
                    })
                );
            }
        }
        setActiveItem(null);
    }

    const handleTodoDelete = (categoryId: string, todoId: string) => {
        setCategories((prevCategories) =>
            prevCategories.map((cat) =>
                cat.id === categoryId ? { ...cat, todos: cat.todos.filter((item) => item.id !== todoId) } : cat
            )
        );
    }

    const handleCategoryDelete = (categoryId: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        setCategoryOrder(prev => prev.filter(id => id !== categoryId));
    }

    const onTodoSave = (content: string, id: string) => {
        setCategories((prevCategories) =>
            prevCategories.map((cat) => ({
                ...cat,
                todos: cat.todos.map((item) => (item.id === id ? { ...item, todo: content } : item))
            }))
        );

    }

    const debugOnKeyPress = (e: React.KeyboardEvent) => { //TODO: remove this debug function
        console.log(e.key)

        if (e.key === "d") {
            console.log("categories: ", categories)
            console.log("categoryOrder: ", categoryOrder)
        }
    }

    return (
        <Box sx={{
            paddingTop: "10px",
            backgroundColor: todoBoardDataState.boardBgColor || "#FFDAC1",
            maxWidth: "90vw",
            margin: "auto",
            marginBottom: "30px",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid black",
            boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)"}}
            onKeyDown={debugOnKeyPress}>
            <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "10px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginBottom: "10px",
                    gap: "10px",
                    }}>
                <BoardTitle title={todoBoardDataState.title} color={todoBoardDataState.titleBgColor || "#C9C9FF"} bigTitle={true}/>
                <Button sx={{
                    margin: "10px",
                    background: "lightblue",
                    borderRadius: "10px",
                    color: "black",
                    border: "1px solid black",
                    }} onClick={addCategory}>Add Category</Button>
            </Box>

            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveItem(null)}>
                <SortableContext items={categoryOrder} strategy={rectSortingStrategy}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "100%", // Ensure the container takes the full width
                        justifyContent: "space-between", // Distribute space between categories
                        gap: "10px" // Add gap between categories
                        }}>
                        {categoryOrder.map((categoryId: string) => {
                            const category = categories.find(cat => cat.id === categoryId);
                            if (!category) {
                                // Optionally log a warning and skip rendering for this id
                                console.warn("Category not found for id:", categoryId);
                                return null;
                            }
                            return <TodoCategory key={categoryId}
                                category={category}
                                boardTodoCounter={boardTodoCounter}
                                setBoardTodoCounter={setBoardTodoCounter}
                                handleTodoDelete={handleTodoDelete}
                                handleCategoryDelete={handleCategoryDelete}
                                onTodoSave={onTodoSave}/>;
                        })}
                    </Box>
                </SortableContext>
                <DragOverlay>
                {activeItem && activeItem.type !== "category" ? (
                    <div
                        style={{
                        padding: '8px',
                        background: activeItem.color || '#456C86',
                        color: 'black',
                        borderRadius: '4px',
                        opacity: 0.5,
                        }}>
                        {activeItem.content}
                    </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </Box>
    )
}

export default TodoBoard