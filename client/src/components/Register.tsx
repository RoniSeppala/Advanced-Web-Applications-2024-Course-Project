import React from "react"
import {Box, Button, Checkbox, FormControlLabel, TextField} from "@mui/material"

const registerUser = async (email: string, password:string, repeatPassword:string, isAdmin: boolean) => {
    console.log(email, password, repeatPassword, isAdmin)

    if (password !== repeatPassword) {
        console.error("Passwords do not match") //TODO: add user visible error message
        return
    }

    try {
        const response = await fetch("/api/users/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email, 
                password: password,
                isAdmin: isAdmin
            })
        })

        if (response.status === 400) {
            const data = await response.json()
            console.log(data.errors)
            throw new Error("invalid input")
        }

        if (!response.ok) {
            console.error("Error registering")
            throw new Error("Error registering")
        }

        const data = await response.json()
        console.log(data)
        
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error when registering" + error.message)
        }
    }
}

const Login:React.FC = () => {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [repeatPassword, setRepeatPassword] = React.useState<string>("")
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
    

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
                <h1>Register</h1>
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
                <TextField
                    required
                    id="repeatPassword"
                    label="Repeat Password"
                    defaultValue=""
                    type="password"
                    sx = {{marginBottom: "10px"}}
                    onChange={(e) => setRepeatPassword(e.target.value)} />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            name="isAdmin"
                            color="primary"
                        />
                    }
                    label="Is Admin"
                />
                <Button
                    variant="contained"
                    id="submit"
                    onClick={() => registerUser(email, password, repeatPassword, isAdmin)}>
                        Regiser
                </Button>
            </Box>
        </>
    )
}

export default Login