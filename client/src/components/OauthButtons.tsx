import React from "react"
import { Button } from "@mui/material"


const OauthButtons:React.FC = () => {
    const handleOauthLogin = (provider: string) => {
        window.location.href = `/api//auth/${provider}`
    }

    return (
        <>
        <Button
            variant="contained"
            id="googleLogin"
            sx={{marginTop: "10px", backgroundColor: "#AA0000"}}
            onClick={(e) => {e.preventDefault(); handleOauthLogin("google")}}>
                Google Login
        </Button>
        <Button
            variant="contained"
            id="twitterLogin"
            sx={{marginTop: "10px", backgroundColor: "black"}}
            onClick={(e) => {e.preventDefault(); handleOauthLogin("twitter")}}>
                Twitter Login
        </Button>
    </>
    )
}

export default OauthButtons