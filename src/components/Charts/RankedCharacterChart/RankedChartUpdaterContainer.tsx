import { charnameToIcon } from "../../../Data/Icons/Characters/Named/CharacterNamedIcons";
import HighchartsReact from "highcharts-react-official"
import { useEffect, useMemo, useRef } from "react";
import { useRankedChartContext } from "./RankedChartContextProvider";
import { useRankedChartData } from "./RankedChartDataContainer";

type RankedChartDataProps = {
    // showPlacements: boolean,
    // uniquePlayers: boolean,
    // region: string ,
    // offlineOnlineStatus: string,
    chartRef: React.RefObject<HighchartsReact.RefObject> // change
}

export function useRankedChartUpdater({ chartRef }: RankedChartDataProps){
    // Series styling data
    const staticConfig = useRef({
        iconWidth: 60,
        iconPadding: 3,
        barColors: ["#00798c","#edae49","#d1495b",],
        intervalTitles: ['< 2200 MR', '2200-2300 MR', '2300+ MR',],
    }).current;
    const chartWidth = useMemo(() => (staticConfig.iconWidth + staticConfig.iconPadding) * 25, [])

    const { playerLimit, sortCriteria, showMR } = useRankedChartContext()
    const { charnameCategories, seriesByPlayerCount, seriesByMRIntervals } = useRankedChartData()

    const seriesList = useMemo((): Highcharts.Options["series"] => {
        // if(sortCriteria === "Representation"){
            if(showMR){
                const res: any[] = []
                for(let i = 2; i >= 0; i--){
                    const tmp = {
                        name: staticConfig.intervalTitles[i],
                        type: 'column',
                        stack: 'MR',
                        color: staticConfig.barColors[i],
                        data: seriesByMRIntervals.map((intervals, idx) => ({
                            y: intervals[i],
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
        // }

    },[showMR, charnameCategories, seriesByPlayerCount, seriesByMRIntervals])

    useEffect(() =>{
        if(chartRef && chartRef.current){
            const chart = chartRef.current.chart
            if(seriesList){
                chart.update({
                    series: seriesList
                }, false, true, true)

            }
            
            chart.update({
                chart: { width: chartWidth, displayErrors: true },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Player Count',
                    },
                },
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
            }, false, true, true)


            chart.redraw()
        }
    }, [seriesList])
}