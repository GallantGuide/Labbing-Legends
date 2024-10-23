import { useMemo,  } from "react"
import { useRankData } from "../../RankedDataContainer"
import { useRankedChartContext } from "./RankedChartContextProvider"

export function useRankedChartData(){
    const { playerLimit, sortCriteria } = useRankedChartContext()
    const { charnamePlayerCountPairs, charnameToPlayersByMR, charnameToStats } = useRankData({ playerLimit })

    const totalPlayers: number = useMemo(() =>
        charnamePlayerCountPairs.reduce((total, [,count]) => total + count, 0)
    ,[charnamePlayerCountPairs])

    const charnameCategories: string[] = useMemo(() =>{
        if(sortCriteria === "Representation")
            return charnamePlayerCountPairs.map(([charName,]) => charName)

        // sortCriteria === "MR"
        const tmp = Object.entries(charnameToPlayersByMR) // sorted by highest MR player for each character
                    .sort(([, playersA],[, playersB]) => {
                        const lenA = playersA.length
                        const lenB = playersB.length
                        if(lenA > 0 && lenB > 0)
                            return parseInt(playersB[0].MR.substring(0, 4), 10) - parseInt(playersA[0].MR.substring(0, 4), 10)
                        if(lenA == 0 && lenB == 0)
                            return 0
                        if(lenA == 0)
                            return -parseInt(playersB[0].MR.substring(0, 4), 10)
                        return -parseInt(playersA[0].MR.substring(0, 4), 10)
                    })
                    .map(([charName,]) => charName)
        return tmp

    },[charnamePlayerCountPairs, charnameToPlayersByMR, sortCriteria])
    
    const seriesByPlayerCount: number[] = useMemo(() => {
        return charnameCategories.map((charName) => (charnameToStats.get(charName)?.totalCount || 0))
    },[charnameCategories, charnameToStats])

    const seriesByMRIntervals: (number[])[] = useMemo(() => {
        return charnameCategories.map((charName) => (charnameToStats.get(charName)?.MRintervalCounts || [0,0,0]))
    }, [charnameCategories, charnameToStats])

    const seriesByHighestMR: number[] = useMemo(() => {
        return charnameCategories.map((charName) => {
            const players = charnameToStats.get(charName)?.players
            if(players){
                if(players.length <= 0) return 0
                return parseInt(players[0].MR.substring(0,4), 10)
            }
            return 0
        })
    },[charnameCategories, charnameToStats])

    return {
        charnameCategories,
        seriesByPlayerCount,
        seriesByMRIntervals,
        seriesByHighestMR,
        totalPlayers
    }
}