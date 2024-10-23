import {createContext, useContext} from 'react'

type RankedChartContextType = {
    playerLimit?: number,
    sortCriteria?: string,
    showMR?: boolean
}

const RankedChartContext = createContext<RankedChartContextType | undefined>(undefined)

export function useRankedChartContext() {
    const context = useContext(RankedChartContext)
    if (context === undefined) {
        throw new Error('useRankedChartContext must be used within a RankedChartProvider')
    }
    return context
}

export function RankedChartContextProvider({children, ...props}: { children: React.ReactNode } & RankedChartContextType){
    return(
        <RankedChartContext.Provider value={props}>
            {children}
        </RankedChartContext.Provider>
    )
}