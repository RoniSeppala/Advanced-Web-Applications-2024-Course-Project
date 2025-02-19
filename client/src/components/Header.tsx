import React from "react"
import {AppBar, Toolbar, Typography, List, ListItemButton, useMediaQuery, Button, IconButton, SwipeableDrawer} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"



const Header:React.FC = () => {
    const isMobile = useMediaQuery('(max-width:600px)')
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false)
    console.log(isMobile)

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const drawerContent = (
        <List>
          <ListItemButton onClick={() => window.location.href = '/'}>Home</ListItemButton>
          <ListItemButton onClick={() => window.location.href = '/Login'}>Login</ListItemButton>
          <ListItemButton onClick={() => window.location.href = '/Register'}>Register</ListItemButton>
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
                        <Button color="inherit" onClick={() => window.location.href = '/'}>Home</Button>
                        <Button color="inherit" onClick={() => window.location.href = '/Login'}>Login</Button>
                        <Button color="inherit" onClick={() => window.location.href = '/Register'}>Register</Button>
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