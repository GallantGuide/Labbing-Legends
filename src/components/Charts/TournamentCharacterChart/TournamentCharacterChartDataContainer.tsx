import { useEffect, useMemo } from "react"
import { useTournamentData } from "../../TournamentDataContainer"
import { allCharacters } from "../../../Data/StaticData"

type TournamentCharacterChartDataProps = {
    showPlacements: boolean,
    uniquePlayers: boolean,
    region: string,
    offlineOnlineStatus: string,
}

export function useTournamentCharacterChartData({ showPlacements, region, offlineOnlineStatus, uniquePlayers }: TournamentCharacterChartDataProps){
    const { characterToPlayersByPlacement, characterToPlayerCountPairs } = useTournamentData({ region, offlineOnlineStatus, uniquePlayers })

    // useEffect(() => {
    //     getBarSeriesDataByPlacementIntervals()
    // },[])

    function getCategories(): string[]{
        // return characterToPlayersByPlacement? Object.keys(characterToPlayersByPlacement) : allCharacters
        return characterToPlayerCountPairs? characterToPlayerCountPairs.map(([charName,]) => charName) : allCharacters
    }

    function getBarSeriesByPlayerCount(): number[]{
        // return characterToPlayersByPlacement? Object.entries(characterToPlayersByPlacement).map(([, player]) => player.length) : []
        return characterToPlayerCountPairs? characterToPlayerCountPairs.map(([,count]) => count) : []
    }

    function getBarSeriesDataByPlacementIntervals(): { [key: string]: number[] } {
        if(characterToPlayersByPlacement){
            const placementIntervals: { [key: string]: number[] } = {}
            const xAxisCharacters = xAxisCategories

            xAxisCharacters.forEach((charName) => {
                const intervals = [0,0,0,0] //assume 3 intervals: top 3, top 8, top 16

                if(characterToPlayersByPlacement[charName]){
                    characterToPlayersByPlacement[charName].forEach((player) => {
                        const placement: number = player.Placement

                        if(placement >= 9){ //top 16
                            intervals[0]++
                        }
                        else if(placement >= 4){ //top 8
                            intervals[1]++
                        }
                        else if(placement >1 ){ //top 3
                            intervals[2]++
                        }
                        else{
                            intervals[3]++
                        }
                    })
                }
                placementIntervals[charName] = intervals
            })
            // console.log(placementIntervals)
            return placementIntervals
        }
        return {}
    }

    const xAxisCategories = useMemo(() => getCategories(), [showPlacements, characterToPlayersByPlacement])
    const barDataByPlayerCount = useMemo(() => getBarSeriesByPlayerCount(), [showPlacements, characterToPlayersByPlacement])
    const barDataByPlacementIntervals = useMemo(() => getBarSeriesDataByPlacementIntervals(), [showPlacements, characterToPlayersByPlacement])

    return { xAxisCategories, barDataByPlayerCount, barDataByPlacementIntervals }
}