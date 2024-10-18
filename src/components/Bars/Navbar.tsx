import { useState } from "react";

import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from "@mui/material"
import { SxProps } from "@mui/material";

import "./navbar.css"
import { color } from "highcharts";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()

    const navbarStyle: SxProps = {
        display: 'flex',
        marginBottom: '30px',
        backgroundColor: '#1b1d21',
        alignItems: 'center',
        // paddingX: 10,
    }

    const buttonStyle: SxProps = {
        my: 0,
        color: 'white',
        display: 'block',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 800,
        textDecoration: 'none',
        marginRight: 2,
    }

    const toolbarStyle: SxProps = {
        minHeight: 55
    }

    const handleButtonClick = (e: any) => {
        // console.log(e.target.textContent)
        const page = e.target.textContent
        switch(page){
            case "Players List":
                // FIXME: should have global constants for these
                if(!location.pathname.includes("/players"))
                    navigate('/players/')
                break
            case 'Rank Character Chart':
                if(!(location.pathname === "/"))
                    navigate('/')
                break
            case 'Tournament Character Chart':
                navigate('/esports/')
                break
        }
    }

    return(
        <AppBar sx={navbarStyle} position="sticky">
            <Toolbar sx={toolbarStyle} variant="dense">
                <Button onClick={handleButtonClick} sx={buttonStyle}>Rank Character Chart</Button>
                <Button onClick={handleButtonClick} sx={buttonStyle}>Players List</Button>
                <Button onClick={handleButtonClick} sx={buttonStyle}>Tournament Character Chart</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar