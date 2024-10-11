import RYU_ICON from "../assets/characterIcons/Named/ryu-icon.png"
import KEN_ICON from "../assets/characterIcons/Named/ken-icon.png"
import CHUNLI_ICON from "../assets/characterIcons/Named/chunli-icon.png"
import GUILE_ICON from "../assets/characterIcons/Named/guile-icon.png"
import JURI_ICON from "../assets/characterIcons/Named/juri-icon.png"
import LUKE_ICON from "../assets/characterIcons/Named/luke-icon.png"
import JAMIE_ICON from "../assets/characterIcons/Named/jamie-icon.png"
import KIMBERLY_ICON from "../assets/characterIcons/Named/kimberly-icon.png"
import EHONDA_ICON from "../assets/characterIcons/Named/ehonda-icon.png"
import BLANKA_ICON from "../assets/characterIcons/Named/blanka-icon.png"
import DHALSIM_ICON from "../assets/characterIcons/Named/dhalsim-icon.png"
import CAMMY_ICON from "../assets/characterIcons/Named/cammy-icon.png"
import DEEJAY_ICON from "../assets/characterIcons/Named/deejay-icon.png"
import MANON_ICON from "../assets/characterIcons/Named/manon-icon.png"
import MARISA_ICON from "../assets/characterIcons/Named/marisa-icon.png"
import JP_ICON from "../assets/characterIcons/Named/jp-icon.png"
import ZANGIEF_ICON from "../assets/characterIcons/Named/zangief-icon.png"
import LILY_ICON from "../assets/characterIcons/Named/lily-icon.png"
import AKUMA_ICON from "../assets/characterIcons/Named/akuma-icon.png"
import BISON_ICON from "../assets/characterIcons/Named/bisonHooded-icon.png"
import TERRY_ICON from "../assets/characterIcons/Named/terry-icon.png"
import RASHID_ICON from "../assets/characterIcons/Named/rashid-icon.png"
import ED_ICON from "../assets/characterIcons/Named/ed-icon.png"
import AKI_ICON from "../assets/characterIcons/Named/aki-icon.png"



import { useState, useEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useRankData } from "./RankDataContainer"
import Highcharts from "highcharts";
import { CharacterToPlayerCountByMRintervals } from "./Types"


type ChartsDataProps = {
    sortCriteria: string,
    showMR: boolean,
    playerLimit: number
}
const allCharacters: string[] = [
    "Ryu",
    "Ken",
    "Chun-Li",
    "Guile",
    "Juri",
    "Luke",
    "Jamie",
    "Kimberly",
    "E. Honda",
    "Blanka",
    "Dhalsim",
    "Cammy",
    "Dee Jay",
    "Manon",
    "Marisa",
    "JP",
    "Zangief",
    "Lily",
    "Akuma",
    "M. Bison",
    "Terry",
    "Rashid",
    "Ed"
]

const charnameToIcon: Record<string, string> = {
    "Ryu": RYU_ICON,
    "Ken": KEN_ICON,
    "Chun-Li": CHUNLI_ICON,
    "Guile": GUILE_ICON,
    "Juri": JURI_ICON,
    "Luke": LUKE_ICON,
    "Jamie": JAMIE_ICON,
    "Kimberly": KIMBERLY_ICON,
    "Edmond Honda": EHONDA_ICON,
    "Blanka": BLANKA_ICON,
    "Dhalsim": DHALSIM_ICON,
    "Cammy": CAMMY_ICON,
    "Dee Jay": DEEJAY_ICON,
    "Manon": MANON_ICON,
    "Marisa": MARISA_ICON,
    "JP": JP_ICON,
    "Zangief": ZANGIEF_ICON,
    "Lily": LILY_ICON,
    "Akuma": AKUMA_ICON,
    "M. Bison": BISON_ICON,
    "Terry": TERRY_ICON,
    "Rashid": RASHID_ICON,
    "Ed": ED_ICON,
    "A.K.I.": AKI_ICON
}

export function useHighchartsData({ sortCriteria, showMR, playerLimit } :ChartsDataProps){

    const { characterPlayerCountPairs, characterToPlayersByMR } = useRankData({ playerLimit })

    const navigate = useNavigate()

    // calulate total players
    const getTotalPlayers = (): number => {
        if(characterPlayerCountPairs){
            const total = characterPlayerCountPairs.reduce((total, pair) => {
                return total + pair[1]
            }, 0)
            return total
        }
        return 100
    }

    // list of character names ordered by MR or frequency (descending)
    function getCategories() {
        if(sortCriteria == "MR"){
            return characterToPlayersByMR? Object.keys(characterToPlayersByMR) : allCharacters
        }
        else if(sortCriteria == "Representation"){
            return characterPlayerCountPairs? characterPlayerCountPairs.map((([character,]) => character)).reverse() : allCharacters
        }
        return []
    }
    
    // list of frequencies per character ordered by MR or frequencies themselves (descending)
    function getBarDataByPlayerCount() {
        if(sortCriteria == "MR"){
            return characterToPlayersByMR? (Object.entries(characterToPlayersByMR)).map((o) => o[1].length) : []
        }
        else if(sortCriteria == "Representation"){
            return characterPlayerCountPairs? characterPlayerCountPairs.map((([,freq]) => freq)).reverse() : []
        }
        return []
    }

    // get all the series data arrays for each character divided by MR
    const getBarSeriesDataByMRIntervals = (): { [key: string]: number[] } => {
        if(characterToPlayersByMR){
            const MRIntervals: CharacterToPlayerCountByMRintervals = {}
            const xAxisCharacters = xAxisCategories 
          
            xAxisCharacters.forEach((charName) => {
                const intervals = [0, 0, 0]  // Assume 3 intervals: 2100-2200, 2200-2300, 2300+
          
                if (characterToPlayersByMR[charName]) {
                    characterToPlayersByMR[charName].forEach(player => {
                        const playerMR = parseInt(player.MR.substring(0, 4), 10)

                        if (playerMR < 2200) {
                            intervals[0]++
                        } else if (playerMR < 2300) {
                            intervals[1]++
                        } else {
                            intervals[2]++
                        }
                    })
                }

                MRIntervals[charName] = intervals
            })
            // console.log(MRIntervals)
            return MRIntervals
        }
        return {}
    }

    // get the formatted series arrays
    const getSeriesList = (): Highcharts.Options["series"] => {
        if(showMR){
            const barDataByMRintervals = getBarSeriesDataByMRIntervals()
            const charNames = xAxisCategories
            return [
                {
                    name: '2300+ MR', //top
                    type: 'column',
                    stack: 'MR',
                    color: '#fe218b',
                    data: charNames.map(charName => barDataByMRintervals[charName][2]),
                },
                {
                    name: '2200-2300 MR', //middle
                    type: 'column',
                    stack: 'MR',
                    color: '#21b0fe',
                    data: charNames.map(charName => barDataByMRintervals[charName][1]),
                },
                {
                    name: '2100-2200 MR', //bottom
                    type: 'column',
                    stack: 'MR',  // Stacking all series into one bar
                    color: '#fed700',
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



    // memoize calculated data
    const xAxisCategories = useMemo(() => getCategories(), 
        [showMR, sortCriteria, characterPlayerCountPairs, characterToPlayersByMR])
    const barDataByPlayerCount = useMemo(() => getBarDataByPlayerCount(), 
        [showMR, sortCriteria, characterPlayerCountPairs, characterToPlayersByMR])
    const seriesList = useMemo(() => getSeriesList(), 
        [showMR, sortCriteria, characterPlayerCountPairs, characterToPlayersByMR])
    
    const totalPlayers = useMemo(() => getTotalPlayers(), [characterPlayerCountPairs])

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
            backgroundColor: 'transparent',
        },
        title: {
            text: `Character Representation of Top ${totalPlayers} Players`,
            align: "center",
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointWidth: 45, // TODO: change width of bars
                borderWidth: 0,
                borderRadius: 0,
            }
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Player Count'
            }
        },
        xAxis: {
            categories: xAxisCategories,
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
        series: seriesList
    };


    return { options }
}