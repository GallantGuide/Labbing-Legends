import { useEffect, useMemo, useRef } from "react";
import { charnameToIcon } from "../../../Data/Icons/Characters/Named/CharacterNamedIcons";
import { useTournamentChartData } from "./TournamentChartDataContainer";
import HighchartsReact from "highcharts-react-official"
import { useTournamentChartContext } from "./TournamentChartContextProvider";

type TournamentChartDataProps = {
    // showPlacements: boolean,
    // uniquePlayers: boolean,
    // region: string ,
    // offlineOnlineStatus: string,
    chartRef: React.RefObject<HighchartsReact.RefObject> // change
}


export function useTournamentChartUpdater({ chartRef }: TournamentChartDataProps){
    // Series styling data
    const staticConfig = useRef({
        iconWidth: 60,
        iconPadding: 3,
        barColors: ["#00798c", "#edae49", "#d1495b", "#3BAD4EFF"],
        intervalTitles: ['Top 16', 'Top 8', 'Top 3', 'Top 1']
    }).current;
    const chartWidth = useMemo(() => (staticConfig.iconWidth + staticConfig.iconPadding) * 24, [])

    const { showPlacements } = useTournamentChartContext()
    const { charnameCategories, seriesByPlayerCount, seriesByPlayerPlacements } = useTournamentChartData()

    // Get series objects
    const seriesList = useMemo((): Highcharts.Options["series"] => {
        if(showPlacements){
            const res: any[] = []
            for(let i = 3; i >= 0; i--){
                const tmp ={
                    name: staticConfig.intervalTitles[i],
                    type: 'column',
                    stack: 'Placements',
                    color: staticConfig.barColors[i],
                    data: seriesByPlayerPlacements.map((placements, idx) => ({
                        y: placements[i],
                        characterIndex: idx
                    })),
                }
                res.push(tmp)
            }
            return res
        }
        return [
            {
                name: 'Player Count',
                type: 'column',
                data: seriesByPlayerCount.map((count, idx) => ({
                    y: count,
                    characterIndex: idx
                })),
                color: '#206DE9FF',
            }
        ]
    }, [showPlacements, charnameCategories, seriesByPlayerCount, seriesByPlayerPlacements])


    useEffect(() =>{

        if(chartRef && chartRef.current){
            const chart = chartRef.current.chart
            if(seriesList){
                chart.update({
                    series: seriesList
                }, true, true)
            }
            
            chart.update({
                chart: { width: chartWidth, displayErrors: true },
                xAxis: {
                    categories: charnameCategories,
                    labels: {
                        formatter: function(){
                            const category = this.value as string
                            return `
                                <img
                                    class="character-icon"
                                    id="${category}"
                                    src="${charnameToIcon[category]}"
                                    style="cursor: pointer; width: ${staticConfig.iconWidth}px; height: ${staticConfig.iconWidth}px;"
                                />
                            `
                        }
                    }
                },
            }, true)


            chart.redraw()
        }
    }, [seriesList])

}