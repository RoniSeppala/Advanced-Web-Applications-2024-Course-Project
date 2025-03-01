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
                todo: string,
                color?: string
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
                todo: string,
                color?: string
            }[]
        }[]
}

interface Category {
    id: string,
    title: string,
    color: string,
    todos: {
        id: string,
        todo: string,
        color?: string
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
    const [todoBoardDataState, setTodoBoardDataState] = React.useState<TodoBoardDataInterface>(todoBoardData)
    const initialCategoryOrder = todoBoardDataState.categories.map((category) => category.id)
    const [categoryOrder, setCategoryOrder] = React.useState<string[]>(initialCategoryOrder)
    const [activeItem, setActiveItem] = React.useState<{ id?: string, content?: string, color?: string, type: string } | null>(null)
    const [boardTodoCounter, setBoardTodoCounter] = React.useState<number>(0)
    const [boardCategoryCounter, setBoardCategoryCounter] = React.useState<number>(0)
    const colorContainerRef = React.useRef<HTMLDivElement>(null)
    const [needsSync, setNeedsSync] = React.useState<boolean>(false)

    //count initial todos
    React.useEffect(() => {
        const count = todoBoardDataState.categories.reduce((acc, category) => acc + category.todos.length, 0)
        if (count > boardTodoCounter) {
            setBoardTodoCounter(count + 1)
        }
    }, [])

    //count initial categories
    React.useEffect(() => {
        const count = todoBoardDataState.categories.length
        if (count > boardCategoryCounter) {
            setBoardCategoryCounter(count + 1)
        }
    }, [])

    const addCategory = async () => {
        setBoardCategoryCounter(boardCategoryCounter + 1)
        console.log("Add category clicked")
        const newCategory: Category = {
            id: `category-${boardCategoryCounter}`,
            title: "New Category " + boardCategoryCounter,
            color: "#D3D3D3",
            todos: []
        }
        setTodoBoardDataState((prevData) => {
            const newCategories = [...prevData.categories, newCategory]
            return { ...prevData, categories: newCategories }
        })
        setCategoryOrder((prevOrder) => [...prevOrder, newCategory.id])
        setNeedsSync(true)
    }

    React.useEffect(() => {
        if (!needsSync) return;
        console.log("Updating board")
        async function updateBoard() {
            const response = await fetch("/api/todos/updateboard", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todoBoard: todoBoardDataState })
            });
            if (!response.ok) {
                console.error("Error updating board");
                return;
            }
            const data = await response.json();
            setTodoBoardDataState(data.todoBoard);
            setNeedsSync(false);
        }
        updateBoard();
    }, [todoBoardDataState, needsSync]);

    const sensors = useSensors(
        useSensor(PointerSensor,{ activationConstraint: { distance: 8} })
    )

    const handleDragStart = (event: any) => {

        if (
            colorContainerRef.current &&
            event.activatorEvent.target instanceof Node &&
            colorContainerRef.current.contains(event.activatorEvent.target)
        ) {
            console.log("drag originated from color container, canceling")
            return;
        }
        
        const { active } = event;
        const { type, categoryId } = active.data.current;
        const activeItemCategory = todoBoardDataState.categories.find((category) => category.id === categoryId);

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
            setNeedsSync(true)
            return;
        }
        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === "category" && overType === "category") {  //category drag
            if (active.id !== over.id) {
                const oldIndex = categoryOrder.indexOf(active.id);
                const newIndex = categoryOrder.indexOf(over.id);
                setCategoryOrder((prevOrder) => arrayMove(prevOrder, oldIndex, newIndex));

                setTodoBoardDataState((prevData) => {
                    const newCategories = arrayMove(prevData.categories, oldIndex, newIndex);
                    return { ...prevData, categories: newCategories };
                });
                setNeedsSync(true)
            }
        }

        if (activeType === "todo" && overType === "todo") {  //todo drag
            const activeCategoryId = active.data.current.categoryId;
            const overCategoryId = over.data.current.categoryId;

            //drop within category
            if (activeCategoryId === overCategoryId) {
                const category = todoBoardDataState.categories.find((category) => category.id === activeCategoryId);
                if (!category) return;
                const categoryItems = category.todos;
                const oldIndex = categoryItems?.findIndex((item) => item.id === active.id);
                const newIndex = categoryItems?.findIndex((item) => item.id === over.id);
                
                setTodoBoardDataState((prevData) => {
                    const newCategories = prevData.categories.map((cat) => 
                        cat.id === activeCategoryId ? { ...cat, todos: arrayMove(categoryItems, oldIndex, newIndex) } : cat)
                    return { ...prevData, categories: newCategories };
                })
                setNeedsSync(true)
            } else { //drop between categories
                const sourceCategory = todoBoardDataState.categories.find((category) => category.id === activeCategoryId);
                if (!sourceCategory) return;
                const sourceItems = Array.from(sourceCategory.todos);

                const destinationCategory = todoBoardDataState.categories.find((category) => category.id === overCategoryId);
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

                setTodoBoardDataState((prevData) => {
                    const newCategories = prevData.categories.map((cat) => {
                        if (cat.id === activeCategoryId) {
                            return { ...cat, todos: sourceItems };
                        }
                        if (cat.id === overCategoryId) {
                            return { ...cat, todos: destItems };
                        }
                        return cat;
                    });
                    return { ...prevData, categories: newCategories };
                })
                setNeedsSync(true)

            }
        }
        setNeedsSync(true)
        setActiveItem(null);
    }

    const handleTodoDelete = (categoryId: string, todoId: string) => {
        setTodoBoardDataState((prevData) => {
            const newCategories = prevData.categories.map((cat) =>
            cat.id === categoryId ? {...cat, todos: cat.todos.filter((item) => item.id !== todoId) } : cat)
            return { ...prevData, categories: newCategories}
        })
        setNeedsSync(true)
    }

    const handleCategoryDelete = (categoryId: string) => {
        setTodoBoardDataState((prevData) => {
            const newCategories = prevData.categories.filter((cat) => cat.id !== categoryId);
            return { ...prevData, categories: newCategories };
        });
        setCategoryOrder(prev => prev.filter(id => id !== categoryId));
        setNeedsSync(true)
    }

    const onTodoSave = (content: string, id: string) => {
        setTodoBoardDataState((prevData) => ({
            ...prevData,
            categories: prevData.categories.map((cat) => ({
            ...cat,
            todos: cat.todos.map((item) => (item.id === id ? { ...item, todo: content } : item))
            }))
        }));
        setNeedsSync(true)

    }

    const onCategoryTitleSave = (newContent: string, id: string) => {
        console.log("This is category title sav function new content: " + newContent)
        console.log("this is category title save id: " + id)
        setTodoBoardDataState((prevData) => ({
            ...prevData,
            categories: prevData.categories.map((cat) => (cat.id === id ? { ...cat, title: newContent } : cat))
        }));
        setNeedsSync(true)
    }

    const onBoardTitleSave = (newContent: string, id: string) => {
        console.log("log redundat id: ", id)
        setTodoBoardDataState((prevData) => ({ ...prevData, title: newContent }));
        setNeedsSync(true)
    }

    const debugOnKeyPress = (e: React.KeyboardEvent) => { //TODO: remove this debug function
        console.log(e.key)

        if (e.key === "d") {
            console.log(todoBoardDataState)
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
                <BoardTitle title={todoBoardDataState.title} color={todoBoardDataState.titleBgColor || "#C9C9FF"} bigTitle={true} onBoardTitleSave={onBoardTitleSave} onCategoryTitleSave={() => {"This is borad title and category title should not be editable here"}} categoryId="this-is-a-board-title-and-shouldnt-have-category-id"/>
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
                            const category = todoBoardDataState.categories.find(cat => cat.id === categoryId);
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
                                onTodoSave={onTodoSave}
                                onCategoryTitleSave={onCategoryTitleSave}
                                colorContainerRef={colorContainerRef}
                                setNeedsSync={setNeedsSync}/>;
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