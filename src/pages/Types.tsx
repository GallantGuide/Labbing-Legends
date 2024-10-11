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
}

export type CharacterToPlayers = {
    [Character: string]: Player[]
}

export type CharacterPlayerCountPairs = [string, number][]

export type RichStyle = {
    [key: string]: {
      height: number;
      backgroundColor: {
        image: string;
      };
    };
};

export type PlayerDataList = (number|string)[][]
