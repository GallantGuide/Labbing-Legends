import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import { useTournamentChartUpdater } from "./TournamentChartUpdaterContainer"
import { createContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useTournamentChartStaticOptions from "./TournamentChartStaticContainer"
import { useTournamentChartContext } from "./TournamentChartContextProvider"

type TournamentChartDataProps = {
    showPlacements: boolean,
    uniquePlayers: boolean,
    region: string ,
    offlineOnlineStatus: string,
    tournamentType: string,
}



export function TournamentChart(){
    const navigate = useNavigate()
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    // Static options contain chart styling
    const { staticOptions } = useTournamentChartStaticOptions()

    const { showPlacements, region, offlineOnlineStatus, uniquePlayers, tournamentType} = useTournamentChartContext()
    
    // Update chart data depending on filter changes
    useTournamentChartUpdater({ chartRef })

    useEffect(() => {
        const chartContainer = document.querySelector('.highcharts-container')
        if(chartContainer){
            chartContainer.addEventListener('click', handleChartClick)
        }

        return () => {
            if(chartContainer){
                chartContainer.removeEventListener('click', handleChartClick)
            }
        }
    }, [region, offlineOnlineStatus, uniquePlayers, tournamentType])

    // **Carries over filters to playerlist page**
    const handleChartClick = (e: any) => {
        const playerDataType = "tournament"
        
        if("attributes" in e.target){
            const attrbs = e.target["attributes"]
            if(attrbs["class"] && attrbs["id"] && attrbs["class"].value == "character-icon"){
                const charName = attrbs["id"].value
                
                // pass state values with navigation to players list page
                navigate(`/players/${charName}`,
                    {state: {playerDataType, region, offlineOnlineStatus, uniquePlayers, tournamentType}})
            }
        }
    }

    return(
        <HighchartsReact highcharts={Highcharts} options={staticOptions} ref={chartRef}/>
    )
}