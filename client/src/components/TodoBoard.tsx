import React from "react";
import TodoCategory from "./TodoCategory";
import { Box } from "@mui/material";
import BoardTitle from "./boardTitle";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";


interface TodoBoardProps {
    todoBoardData: {
        title: string,
        titleBgColor?: string,
        boardBgColor?: string,
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
    const [categoryOrder, setCategoryOrder] = React.useState<string[]>(initialCategoryOrder)
    const [categories, setCategories] = React.useState<Category[]>(todoBoardData.categories)

    const sensors = useSensors(
        useSensor(PointerSensor,{ activationConstraint: { distance: 5} })
    )

    const handleDragEnd = (event: any) => {
        const {active, over} = event
        if (!over) {
            return
        }
        const activeType = active.data.current?.type
        const overType = over.data.current?.type

        if (activeType === "category" || overType === "category") {  //category drag
            if (active.id !== over.id) {
                const oldIndex = categoryOrder.indexOf(active.id)
                const newIndex = categoryOrder.indexOf(over.id)
                setCategoryOrder(arrayMove(categoryOrder, oldIndex, newIndex))
            }
        }


        if (activeType === "todo" || overType === "todo") {  //todo drag
            const activeCategoryId = active.data.current.categoryId
            const overCategoryId = over.data.current.categoryId

            //drop within category
            if (activeCategoryId === overCategoryId){
                const category = todoBoardData.categories.find((category) => category.id === activeCategoryId);
                if (!category) return;
                const categoryItems = category.todos;
                const oldIndex = categoryItems?.findIndex((item) => item.id === active.id)
                const newIndex = categoryItems?.findIndex((item) => item.id === over.id)
                setCategories({
                    ...categories,
                    [activeCategoryId]: {
                        ...categories[activeCategoryId],
                        todos: arrayMove(categoryItems, oldIndex, newIndex)
                    }
                })
            } else { //drop between categories
                
                const sourceCategory = todoBoardData.categories.find((category) => category.id === activeCategoryId);
                if (!sourceCategory) return;
                const sourceItems = Array.from(sourceCategory.todos);

                const destinationCategory = todoBoardData.categories.find((category) => category.id === overCategoryId);
                if (!destinationCategory) return;
                const destItems = Array.from(destinationCategory.todos);

                const sourceIndex = sourceItems.findIndex((item) => item.id === active.id)
                const sourceItem = sourceItems.slice(sourceIndex, sourceIndex + 1)
                const destIndex = destItems.findIndex((item) => item.id === over.id)

                if (destIndex === -1) {
                    destItems.push(sourceItem[0])
                } else {
                    destItems.splice(destIndex, 0, sourceItem[0])
                }

                setCategories({
                    ...categories,
                    [activeCategoryId]: {
                        ...categories[activeCategoryId],
                        todos: sourceItems
                    },
                    [overCategoryId]: {
                        ...categories[overCategoryId],
                        todos: destItems
                    }
                })
            }
        }
    }

    return (
        <Box sx={{
            paddingTop: "10px",
            backgroundColor: todoBoardData.boardBgColor || "#FFDAC1",
            maxWidth: "90vw",
            margin: "auto",
            marginBottom: "30px",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid black",
            boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)"}}>
        <BoardTitle title={todoBoardData.title} color={todoBoardData.titleBgColor || "#C9C9FF"} bigTitle={true}/>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        }}>
                        {categoryOrder.map((categoryId: string) => {
                            const category = categories.find(cat => cat.id === categoryId);
                            return category ? <TodoCategory key={categoryId} category={category}/> : null;
                        })}
                    </Box>
                </SortableContext>
            </DndContext>
        </Box>
    )
}

export default TodoBoard