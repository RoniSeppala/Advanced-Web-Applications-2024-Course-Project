import React from "react";
import TodoCategory from "./TodoCategory";
import { Box, Button } from "@mui/material";
import BoardTitle from "./BoardTitle";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, rectIntersection, useSensor, useSensors, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
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

interface TodoBoardDataInterface { //interface for todo board data 
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

interface Category { //interface for category
    id: string,
    title: string,
    color: string,
    todos: {
        id: string,
        todo: string,
        color?: string
    }[]
}

const TodoBoard:React.FC<TodoBoardProps> = ({ todoBoardData }) => {
    const [todoBoardDataState, setTodoBoardDataState] = React.useState<TodoBoardDataInterface>(todoBoardData) //state for all todo board data

    //dnd kit variables
    const initialCategoryOrder = todoBoardDataState.categories.map((category) => category.id)
    const [categoryOrder, setCategoryOrder] = React.useState<string[]>(initialCategoryOrder)
    const [activeItem, setActiveItem] = React.useState<{ id?: string, content?: string, color?: string, type: string } | null>(null)
    const [boardTodoCounter, setBoardTodoCounter] = React.useState<number>(0) //for unique todo ids
    const [boardCategoryCounter, setBoardCategoryCounter] = React.useState<number>(0) //for unique category ids
    const colorContainerRef = React.useRef<HTMLDivElement>(null)

    //for syncing with database
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

    const addCategory = async () => { // add new category to board
        setBoardCategoryCounter(boardCategoryCounter + 1)
        const newCategory: Category = { //create a empty category
            id: `category-${boardCategoryCounter}`,
            title: "New Category " + boardCategoryCounter,
            color: "#D3D3D3",
            todos: []
        }

        //save new category to variable
        setTodoBoardDataState((prevData) => {
            const newCategories = [...prevData.categories, newCategory]
            return { ...prevData, categories: newCategories }
        })
        setCategoryOrder((prevOrder) => [...prevOrder, newCategory.id])

        //request to save new category to database
        setNeedsSync(true)
    }

    React.useEffect(() => { //save board to database when it changes and it is requested
        if (!needsSync) return; //check if sync is needed
        console.log("Updating board")
        async function updateBoard() { //save to database
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

            //if successful, set needs sync to false and 
            const data = await response.json();
            setTodoBoardDataState(data.todoBoard);
            setNeedsSync(false);
        }
        updateBoard();
    }, [todoBoardDataState, needsSync]);

    const sensors = useSensors( //dnd kit sensors
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    )

    const handleDragStart = (event: DragStartEvent) => { //dnd kit drag start
        if ( //cancel drag if originated from color container
            colorContainerRef.current &&
            event.activatorEvent.target instanceof Node &&
            colorContainerRef.current.contains(event.activatorEvent.target)
        ) {
            return;
        }
        
        const { active } = event;
        const currentData = active.data.current;
        if (!currentData || !('type' in currentData) || !('categoryId' in currentData)) return;
        const { type, categoryId } = currentData;
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

    const handleDragEnd = (event: DragEndEvent) => { //dnd kit drag end
        const { active, over } = event;
        if (!over) {
            setNeedsSync(true)
            return;
        }
        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === "category" && overType === "category") {  //category drag
            if (active.id !== over.id) {
                const oldIndex = categoryOrder.indexOf(active.id as string);
                const newIndex = categoryOrder.indexOf(over.id as string);
                setCategoryOrder((prevOrder) => arrayMove(prevOrder, oldIndex, newIndex));

                setTodoBoardDataState((prevData) => {
                    const newCategories = arrayMove(prevData.categories, oldIndex, newIndex);
                    return { ...prevData, categories: newCategories };
                });
                setNeedsSync(true) //request to save to database
            }
        }

        if (activeType === "todo" && overType === "todo") {  //todo drag
            const activeCategoryId = active.data.current?.categoryId;
            if (!activeCategoryId) return;
            const overCategoryId = over.data.current?.categoryId;

            //drop within category
            if (activeCategoryId === overCategoryId) {
                const category = todoBoardDataState.categories.find((category) => category.id === activeCategoryId);
                if (!category) return;
                const categoryItems = category.todos;
                const oldIndex = categoryItems?.findIndex((item) => item.id === active.id as string);
                const newIndex = categoryItems?.findIndex((item) => item.id === over.id as string);
                
                setTodoBoardDataState((prevData) => {
                    const newCategories = prevData.categories.map((cat) => 
                        cat.id === activeCategoryId ? { ...cat, todos: arrayMove(categoryItems, oldIndex, newIndex) } : cat)
                    return { ...prevData, categories: newCategories };
                })
                setNeedsSync(true) //request to save to database
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

                setTodoBoardDataState((prevData) => { //update state
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
                setNeedsSync(true) //request to save to database

            }
        }
        setNeedsSync(true) //request to save to database
        setActiveItem(null);
    }

    const handleTodoDelete = (categoryId: string, todoId: string) => { //delete todo
        setTodoBoardDataState((prevData) => {
            const newCategories = prevData.categories.map((cat) =>
            cat.id === categoryId ? {...cat, todos: cat.todos.filter((item) => item.id !== todoId) } : cat)
            return { ...prevData, categories: newCategories}
        })
        setNeedsSync(true) //request to save to database
    }

    const handleCategoryDelete = (categoryId: string) => { //delete category
        setTodoBoardDataState((prevData) => {
            const newCategories = prevData.categories.filter((cat) => cat.id !== categoryId);
            return { ...prevData, categories: newCategories };
        });
        setCategoryOrder(prev => prev.filter(id => id !== categoryId));
        setNeedsSync(true) //request to save to database
    }

    const onTodoSave = (content: string, id: string) => { 
        setTodoBoardDataState((prevData) => ({
            ...prevData,
            categories: prevData.categories.map((cat) => ({
            ...cat,
            todos: cat.todos.map((item) => (item.id === id ? { ...item, todo: content } : item))
            }))
        }));
        setNeedsSync(true) //request to save to database

    }

    const onCategoryTitleSave = (newContent: string, id: string) => { //handle ctegory titla change
        setTodoBoardDataState((prevData) => ({
            ...prevData,
            categories: prevData.categories.map((cat) => (cat.id === id ? { ...cat, title: newContent } : cat))
        }));
        setNeedsSync(true) //request to save to database
    }

    const onBoardTitleSave = (newContent: string, id: string) => { //handle board title change
        console.log("log redundat id: ", id)
        setTodoBoardDataState((prevData) => ({ ...prevData, title: newContent }));
        setNeedsSync(true) //request to save to database
    }

    return (
        <Box sx={{ // main container
            paddingTop: "10px",
            backgroundColor: todoBoardDataState.boardBgColor || "#FFDAC1",
            maxWidth: "90vw",
            margin: "auto",
            marginBottom: "30px",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid black",
            boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
            <Box sx={{ //container for board title and add category button
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

            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveItem(null)}> {/*dnd context*/}
                <SortableContext items={categoryOrder} strategy={rectSortingStrategy}>
                    <Box sx={{ //container for categories
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "100%",
                        justifyContent: "space-between",
                        gap: "10px"
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
                <DragOverlay> {/*drag overlay so draging visuals for todos between containers work*/}
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