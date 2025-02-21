import React from "react"
import {Box, Button, TextField} from "@mui/material"



const Login:React.FC = () => {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [errors, setErrors] = React.useState<string[]>([])

    const loginUser = async () => {
        setErrors([])
        

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                console.error("Error logging in")
                throw new Error("Error logging in")
            }

            window.location.href = "/"


        } catch (error) {
            if (error instanceof Error) {
            console.log("Error when logging in ", error.message)
            }
        }
    }

    const handleOauthLogin = (provider: string) => {
        window.location.href = `/api//auth/${provider}`
    }

    return (
        <>
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                loginUser()
            }}
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "300px",
                margin: "20px auto",
                border: "1px solid black",
                padding: "10px",
                paddingTop: "0px",
                borderRadius: "10px"
            }}
            noValidate
            autoComplete="off">
                <h1>Login</h1>
                <TextField
                    required
                    id="email"
                    label="Email"
                    defaultValue=""
                    type="email"
                    sx = {{marginBottom: "10px"}}
                    onChange={(e) => setEmail(e.target.value)} />
                <TextField
                    required
                    id="password"
                    label="Password"
                    defaultValue=""
                    type="password"
                    sx = {{marginBottom: "10px"}}
                    onChange={(e) => setPassword(e.target.value)} />
                {errors.map((error, index) => (
                    <p key={index} style={{color: "red", fontWeight: "bold"}}>{error}</p>
                ))}
                <Button
                    variant="contained"
                    type="submit"
                    id="submit"
                    onClick={(e) => {e.preventDefault(); loginUser()}}>
                        Login
                </Button>
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
                
            </Box>
        </>
    )
}

export default Login