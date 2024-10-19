import { useState, useEffect, useMemo } from "react";
import { CharacterToPlayers, StringToNumber, Player, CharacterPlayerCountPairs } from "../Data/Types";

import { allCharacters } from "../Data/StaticData";

// import ranks from "../Data/Ranksv5.json"
import ranks from "../Data/Players10_16_24v2.json"

type RankDataProps = {
    playerLimit?: number
}

export function useRankData({ playerLimit }: RankDataProps){
    const rankData = ranks

    function getFilteredData(): Player[]{
        return rankData.slice(0, playerLimit? playerLimit : 500)
    }

    function getCharacterPlayerCountPairs() : CharacterPlayerCountPairs {
        const data: Player[] = getFilteredData()
        const tmp: StringToNumber = {}

        data.forEach((player) => {
            const charName = player.Character
            if (charName in tmp)
                tmp[charName]++
            else
                tmp[charName] = 1
        })

        allCharacters.forEach((charName) =>{
            if(!(charName in tmp)){
                tmp[charName] = 0
            }
        })

        return Object.entries(tmp).sort(([, freqA],[,freqB]) => freqA-freqB)
    }

    function getCharacterToPlayersByMR() : CharacterToPlayers{
        const data: Player[] = getFilteredData()
        const tmp: CharacterToPlayers = {}

        for(const player of data){
            const charName = player.Character

            if (charName in tmp)
                tmp[charName].push(player)
            else
                tmp[charName] = [player]
        }

        allCharacters.forEach((charName) =>{
            if(!(charName in tmp)){
                tmp[charName] = []
            }
        })

        return tmp
    }

    function getPlayersListByMR(): Player[] {
        const data: Player[] = getFilteredData()
        const tmp: Player[] = []

        for(const player of data){
            tmp.push(player)
        }

        return tmp
    }

    function getAllCountries() : string[] {
        const data: Player[] = getFilteredData()
        const seen: Set<string> = new Set()
        const tmp: string[] = []

        data.forEach((player) =>{
            const country = player.Country
            if(!(seen.has(country))){
                seen.add(country)
                tmp.push(country)
            }
        })

        return tmp
    }

    const characterPlayerCountPairs: CharacterPlayerCountPairs = useMemo(() => getCharacterPlayerCountPairs(), [rankData, playerLimit])
    const characterToPlayersByMR: CharacterToPlayers = useMemo(() => getCharacterToPlayersByMR(), [rankData, playerLimit])
    const playersListByMR: Player[] = useMemo(() => getPlayersListByMR(), [rankData, playerLimit])
    const playerCountries: string[] = useMemo(() => getAllCountries(), [rankData, playerLimit])

    return {rankData, characterPlayerCountPairs, characterToPlayersByMR, playersListByMR, playerCountries}
}
