import { useEffect, useCallback, useMemo, useRef } from "react";
import { charnameToIcon } from "../../../Data/Icons/Characters/Named/CharacterNamedIcons";
import { useTournamentCharacterChartData } from "./TournamentCharacterChartDataContainer";

type TournamentCharacterChartDataProps = {
    showPlacements: boolean,
    uniquePlayers: boolean,
    region: string ,
    offlineOnlineStatus: string,
}

export function useTournamentCharacterChartOptionsContainer({ showPlacements, region, offlineOnlineStatus, uniquePlayers }: TournamentCharacterChartDataProps){
    const { charnameCategories, seriesByPlayerCount, barDataByPlacementIntervals } = useTournamentCharacterChartData({ showPlacements, region, offlineOnlineStatus, uniquePlayers })

    // Preload images
    useEffect(() =>{
        Object.values(charnameToIcon).forEach((imageUrl) => {
            const img = new Image()
            img.src = imageUrl
        })
    },[])

    const getSeriesList = useCallback((): Highcharts.Options["series"] => {
        if(showPlacements){
            const charNames = charnameCategories

            const barColorsV2 = ["#00798c","#edae49","#d1495b","#3BAD4EFF"] ////bot mid top

            const intervalTitles = ['Top 16', 'Top 8', 'Top 3','Top 1'] //bot mid top

            // Dynamically create each data array in series
            const res: any[] = []
            for(let i = 3; i >= 0; i--){
                const tmp ={
                    name: intervalTitles[i],
                    type: 'column',
                    stack: 'Placements',
                    color: barColorsV2[i],
                    data: charNames.map(charName => barDataByPlacementIntervals[charName][i]),
                    animation: {
                        // duration: 400, // Reduce animation duration
                        // easing: 'easeOutCubic'
                    }
                }
                res.push(tmp)
            }
            // console.log(res)

            return res
        }
        else if(!showPlacements){
            return [
                {
                    name: 'Player Count',
                    type: 'column',
                    data: seriesByPlayerCount,
                    color: '#206DE9FF',
                    animation: {
                        // duration: 400, // Reduce animation duration
                        // easing: 'easeOutCubic'
                    }
                },
            ]
        }
    }, [showPlacements, charnameCategories, seriesByPlayerCount, barDataByPlacementIntervals])

    // Constants for icon size and padding
    const iconWidth = 60  // TODO: change icon size
    const iconPadding = 3
    const chartWidth = (iconWidth + iconPadding) * charnameCategories.length
    
    const options: Highcharts.Options = useMemo(() => ({
        credits: {
            enabled: false,
        },
        chart: {
            type: "column",
            height: 750,
            width: chartWidth,
            backgroundColor: '#252527',
            // backgroundColor: 'transparent',
            borderRadius: 20,
            style:{
                color: 'white',
            },
            animation: {
                // duration: 400, // Reduce animation duration
                // easing: 'easeOutCubic'
            }
        },
        title: {
            text: `Character Representation of Top 16 in Season 2 Tournaments`,
            align: "center",
            style: {
                color: 'white'
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 45, // TODO: change width of bars
                borderWidth: 0,
                borderRadius: 0,
                // dataLabels: {
                //     enabled: true,
                //     format: '{point.percentage:.0f}%'
                // }
                animation: {
                    // duration: 400, // Reduce animation duration
                    // easing: 'easeOutCubic'
                }
            },
            series: {
                opacity: 0.97,
                states:{
                    hover: {
                        enabled: true,
                        opacity: 1,
                    },
                    inactive: {
                        enabled: true,
                        opacity: 0.6
                    },
                },
            }
        },
        legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'top',
            x: 600,
            y: 45,
            floating: true,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            shadow: true,
            events:{}

        },
        tooltip: {
            valueSuffix: ' players'
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Player Count',
                style: {
                    color: 'white',
                    fontSize: '20px'
                }
            },
            labels: {
                style:{
                    color: 'white'
                }
            }
        },
        xAxis: {
            categories: charnameCategories,
            title:{
                margin: 10,
                text: 'Character',
                style: {
                    color: 'white',
                    fontSize: '20px'
                }
            },
            labels: {
                distance: 10,
                useHTML: true,
                rotation: 0,
                formatter: function(){
                    const category = this.value as string
                    return `
                        <img
                            class="character-icon"
                            id="${category}"
                            src="${charnameToIcon[category]}"
                            style="cursor: pointer; width: ${iconWidth}px; height: ${iconWidth}px;"
                        />
                    `
                }
            }
        },
        series: getSeriesList()
    }), [charnameCategories, getSeriesList])

    return { options }
}