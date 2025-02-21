import React from "react"
import {Box, Button, TextField} from "@mui/material"
import OauthButtons from "./OauthButtons"



const Login:React.FC = () => {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [errors, setErrors] = React.useState<string[]>([])

    const loginUser = async () => {
        setErrors([])
        

        try {
            const response = await fetch("/api/auth/local", {
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

            const data = await response.json()

            if (data.errors && (response.status === 400 || response.status === 404 || response.status === 401)) { //show errors to client if errors on login
                const errorList = data.errors
                let errorsTemp: string[] = []

                errorList.forEach((element: { msg: string }) => {
                    errorsTemp.push(element.msg)
                });

                setErrors(errorsTemp)
                console.log(errors)

                throw new Error("invalid input")
            }

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
                    id="submit">
                        Login
                </Button>
                <OauthButtons />
            </Box>
        </>
    )
}

export default Login