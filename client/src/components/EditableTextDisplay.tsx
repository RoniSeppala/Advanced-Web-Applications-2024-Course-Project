import { Button } from "@mui/material";
import React from "react";

interface EditableTextDisplayProps {
    initialContent: string;
    id: string;
    onSave: (newContent: string, id:string) => void;
}

const EdiatableTextDisplay:React.FC<EditableTextDisplayProps> = ({initialContent, id, onSave}) => {
    const [content, setContent] = React.useState<string>(initialContent);
    const [isEditing, setIsEditing] = React.useState<Boolean>(false);
    const [touchStart, setTouchStart] = React.useState<number | null>(null);

    const doubleClickHandler = () => {
        setIsEditing(true);
    }

    const exitHandler = () => {
        setIsEditing(false);
        onSave(content, id);
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }

    const exitWithEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            exitHandler();
        }
    }

    const handleTouchStart = () => {
        setTouchStart(Date.now());
    };

    const handleTouchEnd = () => {
        if (touchStart && Date.now() - touchStart > 500) {
            setIsEditing(true);
        }
        setTouchStart(null);
    };

    return (
        <div onDoubleClick={doubleClickHandler}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={content}
                        onChange={changeHandler}
                        onBlur={exitHandler}
                        onKeyDown={exitWithEnterHandler}
                    />
                    <Button onClick={exitHandler}
                    sx={{
                        backgroundColor: "lightblue",
                        color: "black",
                        borderRadius: "5px",
                        border: "1px solid black",
                        marginLeft: "5px"
                    }}>Save</Button>
                </>
            ) : (
                <div>{content}</div>
            )}
        </div>
    )
}

export default EdiatableTextDisplay;