import './App.css'
import { useRoutes } from 'react-router-dom'
import PlayersListPage from './pages/PlayerList/PlayersListPage'
import RankedChartPage from './pages/Home/RankedChartPage'
import { createTheme, ThemeProvider } from '@mui/material'

import Navbar from './components/Bars/Navbar'
import TournamentChartPage from './pages/Esports/TournamentChartPage'

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
      element: <RankedChartPage/>
    },
    {
      path: "/players/:character?",
      element: <PlayersListPage/>
    },
    {
      path: "/esports/",
      element: <TournamentChartPage/>
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
