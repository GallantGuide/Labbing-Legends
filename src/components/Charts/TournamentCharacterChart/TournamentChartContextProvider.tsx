import {createContext, useContext} from 'react'

type TournamentChartContextType = {
    showPlacements: boolean,
    uniquePlayers: boolean,
    region: string,
    offlineOnlineStatus: string,
    tournamentType: string,
    season: string,
}

const TournamentChartContext = createContext<TournamentChartContextType | undefined>(undefined)

export function useTournamentChartContext() {
    const context = useContext(TournamentChartContext)
    if (context === undefined) {
        throw new Error('useTournamentChartContext must be used within a TournamentChartProvider')
    }
    return context
}

export function TournamentChartContextProvider({children, ...props}: { children: React.ReactNode } & TournamentChartContextType){
    return(
        <TournamentChartContext.Provider value={props}>
            {children}
        </TournamentChartContext.Provider>
    )
}