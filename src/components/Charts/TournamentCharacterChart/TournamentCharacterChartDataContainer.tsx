import { useEffect, useMemo } from "react"
import { useTournamentData } from "../../TournamentDataContainer"
import { allCharacters } from "../../../Data/StaticData"

type TournamentCharacterChartDataProps = {
    showPlacements: boolean,
    uniquePlayers: boolean,
    region: string,
    offlineOnlineStatus: string,
}

export function useTournamentCharacterChartData({ region, offlineOnlineStatus, uniquePlayers }: TournamentCharacterChartDataProps){
    const { charnameToPlayersByPlacement, charnamePlayerCountPairs } = useTournamentData({ region, offlineOnlineStatus, uniquePlayers })

    const charnameCategories = useMemo(() => {
        return charnamePlayerCountPairs? charnamePlayerCountPairs.map(([charName,]) => charName) : allCharacters
    }, [charnameToPlayersByPlacement])

    const seriesByPlayerCount = useMemo(() => {
        return charnamePlayerCountPairs? charnamePlayerCountPairs.map(([,count]) => count) : []
    },[charnameToPlayersByPlacement])

    function getBarSeriesDataByPlacementIntervals(): { [key: string]: number[] } {
        if(charnameToPlayersByPlacement){
            const placementIntervals: { [key: string]: number[] } = {}
            const xAxisCharacters = charnameCategories

            xAxisCharacters.forEach((charName) => {
                const intervals = [0,0,0,0] //assume 3 intervals: top 3, top 8, top 16

                if(charnameToPlayersByPlacement[charName]){
                    charnameToPlayersByPlacement[charName].forEach((player) => {
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
            return placementIntervals
        }
        return {}
    }

    const barDataByPlacementIntervals = useMemo(() => getBarSeriesDataByPlacementIntervals(), [charnameToPlayersByPlacement])

    return { charnameCategories, seriesByPlayerCount, barDataByPlacementIntervals }
}