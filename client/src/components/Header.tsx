import React, { useEffect } from "react"
import {AppBar, Toolbar, Typography, List, ListItemButton, useMediaQuery, Button, IconButton, SwipeableDrawer} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

const Header:React.FC = () => {
    const isMobile = useMediaQuery('(max-width:600px)')
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    useEffect(() => {
        fetch("/api/auth/current_user", {
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

    const logout = async() => {
        await fetch("/api/auth/logout", {
            method: "GET",
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                window.location.href = "/"
            }
        })
      }

    const drawerContent = (
        <List>
          <ListItemButton onClick={() => window.location.href = '/'}>Home</ListItemButton>
          {!isAuthenticated && (<ListItemButton onClick={() => window.location.href = '/Login'}>Login</ListItemButton>)} {/*conditional rendering for login and register in mobile view */}
          {!isAuthenticated && (<ListItemButton onClick={() => window.location.href = '/Register'}>Register</ListItemButton>)}
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
            minWidth: 250, // Set the minimum width for the Drawer
            },}}>
            {drawerContent}
        </SwipeableDrawer>
        </>
    )
}

export default Header