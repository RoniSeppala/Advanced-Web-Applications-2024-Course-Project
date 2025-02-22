import React from "react"
import TodoBoard from "./TodoBoard"

const testdata1 = {
    title: "Work",
    titleBgColor: "#FFDFD3",
    boardBgColor: "#E2F0CB",
    categories: [
        {
            title: "Urgent",
            color: "#FFB3BA", // pastel red
            id: "category-0",
            todos: [
                { id: "item-1", todo: "Finish report" },
                { id: "item-2", todo: "Email client" }
            ]
        },
        {
            title: "Later",
            color: "#B3CDE0", // pastel blue 
            id: "category-1",
            todos: [
                { id: "item-3", todo: "Schedule meeting" },
                { id: "item-4", todo: "Review code" }
            ]
        }
    ]
};

const testdata2 = {
    title: "Personal",
    titleBgColor: "#C9C9FF",
    boardBgColor: "#00ff00",
    categories: [
        {
            title: "Shopping",
            color: "#B2E2B2", // pastel green
            id: "category-3",
            todos: [
                { id: "item-5", todo: "Buy groceries" },
                { id: "item-6", todo: "Order new shoes" }
            ]
        },
        {
            title: "Chores",
            color: "#FFFFBA", // pastel yellow
            id: "category-4",
            todos: [
                { id: "item-7", todo: "Clean kitchen" },
                { id: "item-8", todo: "Mow lawn" }
            ]
        }
    ]
};


const Home:React.FC = () => {
    return (
        <div>
            <h1>Welcome</h1>
            <>
                <TodoBoard todoBoardData={testdata1}/>
                <TodoBoard todoBoardData={testdata2}/>
            </>
        </div>
    )
}

export default Home