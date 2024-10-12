import React from 'react'
import { useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import Header from './components/Bars/Header'
import PlayersListPage from './pages/PlayerList/PlayersListPage'
// import Home_v2 from './pages/Home_v2'
import Home from './pages/Home/Home'

function App() {
  const [count, setCount] = useState<number>(0)

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
      path: "/Highcharts",
      element: <Home/>
    },
    {
      path: "/players/:character",
      element: <PlayersListPage/>
    }
  ])

  return (
    <>
      <div className='App'>
        {element}
      </div>
    </>
  )
}

export default App
