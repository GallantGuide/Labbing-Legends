import { useEffect, useMemo } from "react"
import { useTournamentData } from "../../TournamentDataContainer"
import { useTournamentChartContext } from "./TournamentChartContextProvider"

type TournamentChartDataProps = {
    uniquePlayers: boolean,
    region: string,
    offlineOnlineStatus: string,
}

export function useTournamentChartData(){
    const { showChampions, region, offlineOnlineStatus, uniquePlayers, tournamentType, season } = useTournamentChartContext()
    const { charnamePlayerCountPairs, charnameToStats } = useTournamentData({ region, offlineOnlineStatus, uniquePlayers, tournamentType, season })

    const charnameCategories = useMemo(() => {
        if(!showChampions)
            return charnamePlayerCountPairs.map(([charName,]) => charName)
        const tmp = Array.from(charnameToStats.entries())
                        .sort(([,statsA], [,statsB]) => statsB.placementCounts[3] - statsA.placementCounts[3])
                        .map(([charName,]) => charName)
        return tmp
    }, [charnamePlayerCountPairs, charnameToStats, showChampions])

    const seriesByPlayerCount: number[] = useMemo(() => {
        return charnameCategories.map((charName) => (charnameToStats.get(charName)?.totalCount || 0))
    },[charnameCategories, charnameToStats])

    const seriesByPlayerPlacements: (number[])[] = useMemo(() =>{
        return charnameCategories.map((charName) => (charnameToStats.get(charName)?.placementCounts || [0,0,0,0]))
    }, [charnameCategories, charnameToStats])

    return { charnameCategories, seriesByPlayerCount, seriesByPlayerPlacements }
}