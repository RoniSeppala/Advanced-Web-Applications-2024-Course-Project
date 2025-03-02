import React, { useEffect } from "react"
import {AppBar, Toolbar, Typography, List, ListItemButton, useMediaQuery, Button, IconButton, SwipeableDrawer} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

const Header:React.FC = () => {
    const isMobile: boolean = useMediaQuery('(max-width:600px)') //variables for mobile view, drawer state and autehntication
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)

    const toggleDrawer = () => { //handle drawer toggle
        setDrawerOpen(!drawerOpen)
    }

    useEffect(() => { //check if user is authenticated on page load
        fetch("http://roniseppala.com:1234/api/auth/current_user", {
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        })
    }, [])

    const logout = async() => { //logout function
        await fetch("http://roniseppala.com:1234/api/auth/logout", {
            method: "GET",
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "/"
            }
        })
      }

    const drawerContent = ( //drawer content for mobile view
        <List>
          <ListItemButton onClick={() => window.location.href = '/'}>Home</ListItemButton>
          {!isAuthenticated && (<ListItemButton onClick={() => window.location.href = '/Login'}>Login</ListItemButton>)} {/*conditional rendering for login and register in mobile view */}
          {!isAuthenticated && (<ListItemButton onClick={() => window.location.href = '/Register'}>Register</ListItemButton>)}
          {isAuthenticated && (<ListItemButton color="inherit" onClick={logout}>Logout</ListItemButton>)}
        </List>
      );

    return (
        <>
        <AppBar position="static"
        sx={{left:0,
            boxSizing: "border-box",
            maxHeight: "64px",
            width: "100vw"}}>
            <Toolbar>
                {isMobile && (
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" component={"div"} sx={{flexGrow: 1, left:0, textAlign: "left"}}>
                    My App
                </Typography>
                {!isMobile && (
                    <>
                        {isAuthenticated && (<Button color="inherit" onClick={logout}>Logout</Button>)} {/*conditional rendering for login and register in desktop view*/}
                        <Button color="inherit" onClick={() => window.location.href = '/'}>Home</Button>
                        {!isAuthenticated && (<Button color="inherit" onClick={() => window.location.href = '/Login'}>Login</Button>)} 
                        {!isAuthenticated && (<Button color="inherit" onClick={() => window.location.href = '/Register'}>Register</Button>)}
                    </>
                )}
            </Toolbar>
        </AppBar>
        <SwipeableDrawer
            open={drawerOpen}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
            anchor="left"
            PaperProps={{
            style: {
            minWidth: 250,
            },}}>
            {drawerContent}
        </SwipeableDrawer>
        </>
    )
}

export default Header