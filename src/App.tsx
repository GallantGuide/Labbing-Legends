import React, { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import Header from './components/Bars/Navbar'
import PlayersListPage from './pages/PlayerList/PlayersListPage'
import Home from './pages/Home/Home'
import { createTheme, ThemeProvider } from '@mui/material'

import { GlobalProvider } from './pages/GlobalProvider'
import Navbar from './components/Bars/Navbar'

// Global themes for MUI components
const customTheme = createTheme({
  typography:{
    // fontFamily: 'Komika',
    // fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
  },
  components:{
    // MuiToolbar:{
    //   styleOverrides:{
    //     root:{
    //       minHeight: 30,
    //     }
    //   },
      
    // }
  }
})

function App() {
  let element = useRoutes([
    // {
    //   // path: "/",
    //   // element: <Header />,
    //   // children: [
    //   //   {
    //       path: "/ECharts",
    //       element: <Home_v2/>
    //     // }
    //   // ]
    // },
    {// FIXME: should have global constants for these
      path: "/",
      element: <Home/>
    },
    {
      path: "/players/:character?",
      element: <PlayersListPage/>
    }
  ])

  return (
      <ThemeProvider theme={customTheme}>
        <div className='App'>
            <Navbar/>
            {element}
        </div>
      </ThemeProvider>
  )
}

export default App
