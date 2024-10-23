import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useRankedChartContext } from "./RankedChartContextProvider"
import { useRankedChartUpdater } from "./RankedChartUpdaterContainer"
import useRankedChartStaticOptions from "./RankedChartStaticContainer"

type RankedChartDataProps = {

}

export function RankedChart(){
    const navigate = useNavigate()
    const chartRef = useRef<HighchartsReact.RefObject>(null)

    // Static options contain chart styling
    const { staticOptions } = useRankedChartStaticOptions()
    const { playerLimit } = useRankedChartContext()
    // Update chart data depending on filter changes

    useRankedChartUpdater({ chartRef })

    // icon listeners
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
    }, [playerLimit])

    const handleChartClick = (e: any) => {
        const playerDataType = "ranked"

        if("attributes" in e.target){
            const attrbs = e.target["attributes"]
            if(attrbs["class"] && attrbs["id"] && attrbs["class"].value == "character-icon"){
                const charName = attrbs["id"].value
                
                // pass state values with navigation to players list page
                navigate(`/players/${charName}`, {state: { playerDataType, playerLimit,}})
            }
        }
    }

    return(
        <HighchartsReact highcharts={Highcharts} options={staticOptions} ref={chartRef}/>
    )
}