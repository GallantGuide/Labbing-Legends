import { useEffect, useMemo } from "react"
import { useTournamentData } from "../../TournamentDataContainer"
import { useTournamentChartContext } from "./TournamentChartContextProvider"

type TournamentChartDataProps = {
    uniquePlayers: boolean,
    region: string,
    offlineOnlineStatus: string,
}

export function useTournamentChartData(){
    const { region, offlineOnlineStatus, uniquePlayers, tournamentType } = useTournamentChartContext()
    const { charnamePlayerCountPairs, charnameToStats } = useTournamentData({ region, offlineOnlineStatus, uniquePlayers, tournamentType })

    const charnameCategories = useMemo(() => {
        return charnamePlayerCountPairs.map(([charName,]) => charName)
    }, [charnamePlayerCountPairs])

    const seriesByPlayerCount: number[] = useMemo(() => {
        return charnamePlayerCountPairs.map(([,count]) => count)
    },[charnamePlayerCountPairs])

    const seriesByPlayerPlacements: (number[])[] = useMemo(() =>{
        return charnamePlayerCountPairs.map(([charName,]) => (charnameToStats.get(charName)?.placementCounts || [0,0,0,0]))
    }, [charnamePlayerCountPairs, charnameToStats])

    return { charnameCategories, seriesByPlayerCount, seriesByPlayerPlacements }
}