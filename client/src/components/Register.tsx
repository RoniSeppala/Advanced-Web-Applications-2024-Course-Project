import React from "react"
import {Box, Button, Checkbox, FormControlLabel, TextField} from "@mui/material"
import OauthButtons from "./OauthButtons"

const Register:React.FC = () => {
    const [email, setEmail] = React.useState<string>("")  //variables for all editable fields and errors
    const [password, setPassword] = React.useState<string>("")
    const [repeatPassword, setRepeatPassword] = React.useState<string>("")
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
    const [errors, setErrors] = React.useState<string[]>([])
    const [displayName, setDisplayName] = React.useState<string>("")

    const registerUser = async () => {
        setErrors([]) //clear errors

        if (password !== repeatPassword) { //check if passwords match
            console.error("Passwords do not match") 
            setErrors(["Passwords do not match"])
            return
        }

        try {
            const response = await fetch("/api/auth/register", { //try registering
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    isAdmin: isAdmin,
                    displayName: displayName
                })
            })
            const data = await response.json()

            if (response.status === 400) { //server responds with status 400 if there is an input error, this function displays errors to user
                const errorList = data.errors
                let errorsTemp: string[] = []

                errorList.forEach((element: { msg: string }) => {
                    errorsTemp.push(element.msg)
                });

                setErrors(errorsTemp)

                throw new Error("invalid input")
            }

            if (!response.ok) { //ir status is not 400 but there still was an error, this exits the function
                console.error("Error registering")
                throw new Error("Error registering")
            }

            window.location.href = "http://roniseppala.com:9000/login" //redirect to login page if registration successful

        } catch (error) {
            if (error instanceof Error) {
                console.log("Error when registering" + error.message)
            }
        }
    }

    return (
        <>
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                registerUser()
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
                    id="displayName"
                    label="Name"
                    defaultValue=""
                    sx = {{marginBottom: "10px"}}
                    onChange={(e) => setDisplayName(e.target.value)} />
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
                { errors.map((error, index) => { //display errors
                    return <p key={index} style={{color: "red", fontWeight: "bold"}}>{error}</p>
                })
                }
                <Button
                    variant="contained"
                    id="submit"
                    type="submit">
                        Register
                </Button>
                <OauthButtons page="Register"/>
            </Box>
        </>
    )
}

export default Register
