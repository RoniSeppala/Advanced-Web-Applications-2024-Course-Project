import React, { useEffect } from "react"
import TodoBoard from "./TodoBoard"
import { Button, Box } from "@mui/material";

interface IUser { //interface for user
    email?: string;
    password?: string;
    isAdmin: boolean;
    googleId?: string;
    facebookId?: string;
    twitterId?: string;
    displayName?: string;
    _id: string;
    __v: number;
}
interface ITodoBoard {  //interface for todo board
    title: string,
    titleBgColor: string,
    boardBgColor: string,
    usersIDs: string[],
    categories: {
        id: string,
        title: string,
        color: string,
        todos: {
            id: string,
            todo: string,
            color?: string
        }[]
    }[],
    _id?: string;
    __v?: number;

}

const Home:React.FC = () => {
    const [user, setUser] = React.useState<IUser | null>(null) //current user
    const [todoBoards, setTodoBoards] = React.useState<ITodoBoard[]>([]) //todo boards

    useEffect(() => {  //authenticate use and get his boards
        fetch("/api/auth/current_user", {
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setUser(data.user)
            } else {
                console.log("No user logged in")
            }
        }).then(() => {
            fetch("/api/todos/getboards", {
                credentials: "include"
            }).then(response => response.json()).then(data => {
                console.log(data.todoBoards)  //TODO: add board getting
                setTodoBoards(data.todoBoards)
            })
        })
    }, [])

    const createBoard = async () => { //create new board and save it to database
        if (!user) {
            await fetch("/api/auth/current_user", {
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user)
                } else {
                    console.log("No user logged in")
                }
            })
            console.log("No user logged in")
            return
        }

        const newBoard:ITodoBoard = {
            title: "New Board",
            titleBgColor: "#FFDFD3",
            boardBgColor: "#E2F0CB",
            usersIDs: [user?._id],
            categories: []
        }

        const response = await fetch("/api/todos/createboard", { //create new board
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBoard)
        });

        const data = await response.json();

        if (response.status === 401) { //if not authenticated return
            console.error("Not authenticated")
            return
        }

        if (data.error) { //if error return
            console.error(data.error)
            return
        }

        if (!response.ok) { //if not ok return
            console.error("Failed to create board");
            return
        }

        if (data.todoBoards) {  //if board created successfully, update boards
            setTodoBoards(data.todoBoards)
        }
    }

    return (
        <div>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                <h1>Welcome  {user?.displayName || ""}</h1>
                {!user || <Button onClick={createBoard}
                sx={{
                    backgroundColor: "lightblue",
                    color: "#000000",
                    borderRadius: "10px",
                    border: "1px solid black",
                    padding: "20px",
                    marginLeft: "20px"
                    
                }}>Create Board</Button>}
            </Box> 
            {/*load all todo boards*/}
            {todoBoards.map((board, index) => {
                return <TodoBoard key={index} todoBoardData={board} />
            })}
        </div>
    )
}

export default Home