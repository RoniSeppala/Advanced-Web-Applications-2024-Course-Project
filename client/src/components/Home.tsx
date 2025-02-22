import React from "react"
import TodoBoard from "./TodoBoard"
const testdata1 = {
    title: "Work Projects",
    categories: [
        {
            title: "Development",
            color: "#FFB3BA", // pastel pink
            todos: ["Implement authentication", "Fix login bug", "Refactor codebase"]
        },
        {
            title: "Design",
            color: "#FFDFBA", // pastel orange
            todos: ["Create wireframes", "Update UI components", "Review design mockups"]
        }
    ]
}

const testdata2 = {
    title: "Personal Tasks",
    categories: [
        {
            title: "Groceries",
            color: "#BAE1FF", // pastel blue
            todos: ["Buy milk", "Get bread", "Purchase vegetables"]
        },
        {
            title: "Fitness",
            color: "#FFDFD3", // pastel peach
            todos: ["Morning run", "Yoga session", "Gym workout"]
        },
        {
            title: "Reading",
            color: "#FFFFBA", // pastel yellow
            todos: ["Read 'Atomic Habits'", "Finish 'Clean Code'", "Start 'The Pragmatic Programmer'"]
        },
        {
            title: "Chores",
            color: "#BAFFC9", // pastel green
            todos: ["Clean the kitchen", "Do the laundry", "Organize the garage"]
        }
    ]
}


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