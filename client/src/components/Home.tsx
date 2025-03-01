import React, { useEffect } from "react"
import TodoBoard from "./TodoBoard"
import { Button, Box } from "@mui/material";

interface IUser {
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
interface ITodoBoard {
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

    const [user, setUser] = React.useState<IUser | null>(null)
    const [todoBoards, setTodoBoards] = React.useState<ITodoBoard[]>([])

    useEffect(() => {
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

    const createBoard = async () => {
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

        console.log(user._id)

        const newBoard:ITodoBoard = {
            title: "New Board",
            titleBgColor: "#FFDFD3",
            boardBgColor: "#E2F0CB",
            usersIDs: [user?._id],
            categories: []
        }

        const response = await fetch("/api/todos/createboard", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBoard)
        });

        const data = await response.json();
        console.log(data);

        if (response.status === 401) {
            console.error("Not authenticated")
            return
        }

        if (data.error) {
            console.error(data.error)
            return
        }

        if (!response.ok) {
            console.error("Failed to create board");
            return
        }

        if (data.todoBoards) {
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
            {todoBoards.map((board, index) => {
                return <TodoBoard key={index} todoBoardData={board} />
            })}
        </div>
    )
}

export default Home