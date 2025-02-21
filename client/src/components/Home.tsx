import { Box } from "@mui/material"
import React from "react"
import TodoBoard from "./TodoBoard"



const Home:React.FC = () => {
    return (
        <div>
            <h1>Welcome</h1>
            <Box
                sx={{
                    backgroundColor: "#f0f0f0",
                    maxWidth: "90vw",
                    margin: "auto",
                }}>
                <TodoBoard/>
            </Box>
        </div>
    )
}

export default Home