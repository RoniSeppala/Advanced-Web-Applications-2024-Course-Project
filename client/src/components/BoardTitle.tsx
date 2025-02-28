import { Box } from "@mui/material";
import { darken } from "@mui/material/styles";
import React from "react";
import EdiatableTextDisplay from "./EditableTextDisplay";

interface BoardTitleProps {
    title: string,
    color: string,
    bigTitle?: boolean,
    categoryId: string,
    onBoardTitleSave: (newContent: string, id:string) => void,
    onCategoryTitleSave: (newContent: string, id:string) => void,
}

const BoardTitle:React.FC<BoardTitleProps> = ({title, color, bigTitle = false, onBoardTitleSave, onCategoryTitleSave, categoryId}) => {

    const boardBgColor = darken(color, 0.1)

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
            {bigTitle && <h1><EdiatableTextDisplay initialContent={title} id="headBoardTitle" onSave={onBoardTitleSave}/> </h1>}
            {!bigTitle && <h2><EdiatableTextDisplay initialContent={title} id={categoryId || "no-category-id"} onSave={onCategoryTitleSave}/></h2>}
        </Box>
    )
}

export default BoardTitle