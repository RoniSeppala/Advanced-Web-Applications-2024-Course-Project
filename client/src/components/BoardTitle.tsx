import { Box } from "@mui/material";
import { darken } from "@mui/material/styles";
import { border } from "@mui/system";
import React from "react";


interface BoardTitleProps {
    title?: string,
    color: string,
    bigTitle?: boolean
}

const BoardTitle:React.FC<BoardTitleProps> = ({title, color, bigTitle = false}) => {
    console.log("color", color)
    const boardBgColor = darken(color, 0.1)
    console.log("boardBgColor", boardBgColor)

    return (
        <Box sx={{
            backgroundColor: boardBgColor,
            width: "90%",
            margin: "10px auto",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            borderRadius: "10px",
            border: "1px solid black",
        }}>
            {bigTitle && <h1>{title}</h1>}
            {!bigTitle && <h2>{title}</h2>}
        </Box>
    )
}

export default BoardTitle