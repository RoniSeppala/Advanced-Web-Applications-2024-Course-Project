import React from "react"
import {Box, Button, TextField} from "@mui/material"

const loginUser = async (email: string, password:string) => {
    console.log(email, password)  //TODO: delete
    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email, 
                password: password
            })
        })

        if (response.status === 400) {
            const data = await response.json()
            console.log(data.errors)
            throw new Error("invalid input")
        }

        if (!response.ok) {
            console.error("Error logging in")
            throw new Error("Error logging in")
        }

        const data = await response.json()
        console.log(data)

    } catch (error) {
        if (error instanceof Error) {
            console.log("Error when loging in," + error.message)
        }
    }

}

const Login:React.FC = () => {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    

    return (
        <>
        <Box
            component="form"
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
                <Button
                    variant="contained"
                    id="submit"
                    onClick={() => loginUser(email, password)}>
                        Login
                </Button>
            </Box>
        </>
    )
}

export default Login