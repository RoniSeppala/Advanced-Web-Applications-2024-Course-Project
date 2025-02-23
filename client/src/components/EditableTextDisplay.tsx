import React from "react";

interface EditableTextDisplayProps {
    initialContent: string;
    id: number;
    onSave: (newContent: string, id:number) => void;
}

const EdiatableTextDisplay:React.FC<EditableTextDisplayProps> = ({initialContent, id, onSave}) => {
    const [content, setContent] = React.useState<string>(initialContent);
    const [isEditing, setIsEditing] = React.useState<Boolean>(false);

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

    return (
        <div onDoubleClick={doubleClickHandler}>
            {isEditing ? (
                <input
                    type="text"
                    value={content}
                    onChange={changeHandler}
                    onBlur={exitHandler}
                    onKeyDown={exitWithEnterHandler}
                />
            ) : (
                <div>{content}</div>
            )}
        </div>
    )
}

export default EdiatableTextDisplay;