import { create } from '@mui/material/styles/createTransitions'
import React, { createContext, useState } from 'react'

interface GlobalContextType {
    sortCriteria: string;
    setSortCriteria: React.Dispatch<React.SetStateAction<string>>;
    showMR: boolean;
    setShowMR: React.Dispatch<React.SetStateAction<boolean>>;
    playerLimit: number;
    setPlayerLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }) => {
    const [sortCriteria, setSortCriteria] = useState<string>("Representation")
    const [showMR, setShowMR] = useState<boolean>(false)
    const [playerLimit, setPlayerLimit] = useState<number>(500)

    return(
        <GlobalContext.Provider value={{sortCriteria, setSortCriteria, showMR, setShowMR, playerLimit, setPlayerLimit}}>
            {children}
        </GlobalContext.Provider>
    )

}