/**
 * Naming Conventions/Rules:

 * Anything with an 's' at the end implies the usage of an array
 * 'By' keyword indicates a sorting/grouping criteria
 * 
 * (nameA)To(nameB)           implies Object notation of property-to-value
 * (nameA)(nameB)Pairs        implies Array notation of [(nameA), (nameB)]
 * 
 */

export type StringToNumber = {
    [key: string]: number
}

export type StringToNumbers = {
    [key: string]: number[]
}

export type CharacterToPlayerCountByMRintervals = StringToNumbers

export type Player = {
    CFN : string,
    Rank: string,
    MR: string,
    Character: string,
    Usercode: string,
    Country: string,
    League: string,
}

export type CharacterToPlayers = {
    [Character: string]: Player[]
}

export type CharacterPlayerCountPairs = [string, number][]

export type CountryPlayerCountPairs = [string, number][]

export type PlayerDataList = (number|string)[][]

/* Prop Data Types */
export type CountryPlayerCountDataProps = {
    playerLimit: number
}

export type ChartsDataProps = {
    sortCriteria: string,
    showMR: boolean,
    playerLimit: number
}



