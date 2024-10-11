import { useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import Header from './components/Header'
import PlayersPage from './pages/PlayersPage'
// import Home_v2 from './pages/Home_v2'
import Home_v3 from './pages/Home_v3'

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
      element: <Home_v3/>
    },
    {
      path: "/players/:character",
      element: <PlayersPage/>
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
