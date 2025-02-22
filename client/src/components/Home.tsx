import React from "react"
import TodoBoard from "./TodoBoard"
const testdata1 = {
    title: "Work",
    categories: [
        {
            title: "Urgent",
            color: "#FFB3BA", // pastel red
            id: 0,
            todos: [
                { id: 1, todo: "Finish report" },
                { id: 2, todo: "Email client" }
            ]
        },
        {
            title: "Later",
            color: "#B3CDE0", // pastel blue 
            id: 1,
            todos: [
                { id: 3, todo: "Schedule meeting" },
                { id: 4, todo: "Review code" }
            ]
        }
    ]
};

const testdata2 = {
    title: "Personal",
    categories: [
        {
            title: "Shopping",
            color: "#B2E2B2", // pastel green
            id: 0,
            todos: [
                { id: 5, todo: "Buy groceries" },
                { id: 6, todo: "Order new shoes" }
            ]
        },
        {
            title: "Chores",
            color: "#FFFFBA", // pastel yellow
            id: 1,
            todos: [
                { id: 7, todo: "Clean kitchen" },
                { id: 8, todo: "Mow lawn" }
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