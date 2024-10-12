import { charnameToIcon } from "../../Data/Icons";

import { useState, useEffect, useMemo, useRef } from "react"
import { useTopPlayersChartData } from "./TopPlayersChartDataContainer";
import { ChartsDataProps } from "../../Data/Types";

export function useTopPlayersChartOptions({ sortCriteria, showMR, playerLimit }: ChartsDataProps){
    const { xAxisCategories, barDataByPlayerCount, barDataByMRintervals, totalPlayers } = useTopPlayersChartData({ sortCriteria, showMR, playerLimit })

    // get the formatted series arrays
    const getSeriesList = (): Highcharts.Options["series"] => {
        if(showMR){
            const charNames = xAxisCategories
            return [
                {
                    name: '2300+ MR', //top
                    type: 'column',
                    stack: 'MR',
                    // color: '#fe218b',
                    color: '#C93127',
                    data: charNames.map(charName => barDataByMRintervals[charName][2]),
                },
                {
                    name: '2200-2300 MR', //middle
                    type: 'column',
                    stack: 'MR',
                    // color: '#21b0fe',
                    color: '#F1D04A',
                    data: charNames.map(charName => barDataByMRintervals[charName][1]),
                },
                {
                    name: '2100-2200 MR', //bottom
                    type: 'column',
                    stack: 'MR',  // Stacking all series into one bar
                    // color: '#fed700',
                    color: '#20ACC9',
                    data: charNames.map(charName => barDataByMRintervals[charName][0]),
                },

            ]
        }
        else if(!showMR){
            return [
                {
                    name: 'Player Count',
                    type: 'column',
                    data: barDataByPlayerCount,
                    color: '#206DE9FF'
                },
            ]
        }
    }

    // Constants for icon size and padding
    const iconWidth = 60  // TODO: change icon size
    const iconPadding = 1 
    const chartWidth = (iconWidth + iconPadding) * xAxisCategories.length  

    const options: Highcharts.Options = {
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
            }
        },
        title: {
            text: `Character Representation of Top ${totalPlayers} Players`,
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
            },
            series: {
                opacity: 0.9,
                states:{
                    hover: {
                        enabled: true,
                        opacity: 1,
                    },
                    inactive: {
                        enabled: false,
                    }
                }
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
            shadow: true
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
            categories: xAxisCategories,
            title:{
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
    }

    return { options }
}