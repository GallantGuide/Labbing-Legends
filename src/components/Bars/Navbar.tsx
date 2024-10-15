import { useState } from "react";

import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from "@mui/material"
import { SxProps } from "@mui/material";

import "./navbar.css"
import { color } from "highcharts";
import { useNavigate } from "react-router-dom";

function Navbar() {
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
        fontWeight: 1000,
        textDecoration: 'none',
        marginRight: 2,
    }

    const handleButtonClick = (e: any) => {
        console.log(e.target.textContent)
        const page = e.target.textContent
        switch(page){
            case "Players List":
                navigate('/players/')
                break
            case 'Top Players Chart':
                navigate('/')
                break
        }
    }

    return(
        <AppBar sx={navbarStyle} position="sticky">
            <Toolbar sx={{}} disableGutters>
                <Button onClick={handleButtonClick} sx={buttonStyle}>Top Players Chart</Button>
                <Button onClick={handleButtonClick} sx={buttonStyle}>Players List</Button>
                <Button onClick={handleButtonClick} sx={buttonStyle}>Esports</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar