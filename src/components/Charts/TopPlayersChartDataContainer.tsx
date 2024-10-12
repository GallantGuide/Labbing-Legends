import { useState, useEffect, useMemo, useRef } from "react"
import { useRankData } from "../RankDataContainer"
import { CharacterToPlayerCountByMRintervals, ChartsDataProps } from "../../Data/Types"

import { allCharacters } from "../../Data/StaticData";

export function useTopPlayersChartData({ sortCriteria, showMR, playerLimit } :ChartsDataProps){

    const { characterPlayerCountPairs, characterToPlayersByMR } = useRankData({ playerLimit })

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
    function getBarSeriesDataByPlayerCount(): number[]{
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

    // memoize calculated data
    const xAxisCategories = useMemo(() => getCategories(), 
        [showMR, sortCriteria, characterPlayerCountPairs, characterToPlayersByMR])

    const barDataByPlayerCount = useMemo(() => getBarSeriesDataByPlayerCount(), 
        [showMR, sortCriteria, characterPlayerCountPairs, characterToPlayersByMR])
    const barDataByMRintervals = useMemo(() => getBarSeriesDataByMRIntervals(), 
        [showMR, sortCriteria, characterPlayerCountPairs, characterToPlayersByMR])
    
    const totalPlayers = useMemo(() => getTotalPlayers(), [characterPlayerCountPairs])

    return { xAxisCategories, barDataByPlayerCount, barDataByMRintervals, totalPlayers }
}