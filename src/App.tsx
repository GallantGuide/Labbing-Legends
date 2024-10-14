import React, { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import Header from './components/Bars/Header'
import PlayersListPage from './pages/PlayerList/PlayersListPage'
import Home from './pages/Home/Home'
import { createTheme, ThemeProvider } from '@mui/material'

import { GlobalProvider } from './pages/GlobalProvider'

// Global themes for MUI components
const customTheme = createTheme({
  typography:{
    // fontFamily: 'Komika',
  },
})

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  },[])

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
    {
      path: "/",
      element: <Home/>
    },
    {
      path: "/players/:character",
      element: <PlayersListPage/>
    }
  ])

  return (
      <ThemeProvider theme={customTheme}>
          {isLoading &&
            <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              width: '100vw',
              backgroundImage: 'url("./assets/SF6_Background.jpeg")',
            }}
          />
          }
        <div className='App'>
            {element}
        </div>
      </ThemeProvider>
  )
}

export default App
