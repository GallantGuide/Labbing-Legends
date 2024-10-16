import { useState, useEffect, useMemo } from "react";
import { CharacterToPlayers, StringToNumber, Player, PlayerDataList, CharacterPlayerCountPairs } from "../Data/Types";

// import ranks from "../Data/Ranksv5.json"
import ranks from "../Data/Players10_14_24.json"

type RankDataProps = {
    playerLimit?: number
}

export function useRankData({ playerLimit }: RankDataProps){
    const rankData = ranks["data"]

    function getCharacterPlayerCountPairs() : CharacterPlayerCountPairs {
        const data: PlayerDataList = rankData.slice(0, playerLimit? playerLimit : 500)
        const tmp: StringToNumber = {}

        data.forEach((player) => {
            const charName = player[4]
            if (charName in tmp)
                tmp[charName]++
            else
                tmp[charName] = 1
        })

        return Object.entries(tmp).sort(([, freqA],[,freqB]) => freqA-freqB)
    }

    function getCharacterToPlayersByMR() : CharacterToPlayers{
        const data: PlayerDataList = rankData.slice(0, playerLimit? playerLimit : 500)
        const tmp: CharacterToPlayers = {}

        for(const player of data){
            const charName = player[4]
            const playerCFN = player[1]
            const playerRank = player[2]
            const playerMR = player[3]
            const userCode = player[5]
            const country = player[6]
            const league = player[7]

            const playerObj: Player = {
                CFN : playerCFN.toString(),
                Rank: playerRank.toString(),
                MR: playerMR.toString(),
                Character: charName.toString(),
                Usercode: userCode.toString(),
                Country: country.toString(),
                League: league.toString(),
            }

            if (charName in tmp)
                tmp[charName].push(playerObj)
            else
                tmp[charName] = [playerObj]
        }

        return tmp
    }

    function getPlayersListByMR(): Player[] {
        const data: PlayerDataList = rankData.slice(0, playerLimit? playerLimit : 500)
        const tmp: Player[] = []

        for(const player of data){
            const charName = player[4]
            const playerCFN = player[1]
            const playerRank = player[2]
            const playerMR = player[3]
            const userCode = player[5]
            const country = player[6]
            const league = player[7]

            const playerObj: Player = {
                CFN : playerCFN.toString(),
                Rank: playerRank.toString(),
                MR: playerMR.toString(),
                Character: charName.toString(),
                Usercode: userCode.toString(),
                Country: country.toString(),
                League: league.toString(),
            }

            tmp.push(playerObj)
        }

        return tmp
    }

    function getAllCountries() : string[] {
        const data: PlayerDataList = rankData.slice(0, playerLimit? playerLimit : 500)
        const seen: Set<string> = new Set()
        const tmp: string[] = []

        data.forEach((player) =>{
            const country = player[6].toString()
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
    const allCountries: string[] = useMemo(() => getAllCountries(), [rankData, playerLimit])

    return {rankData, characterPlayerCountPairs, characterToPlayersByMR, playersListByMR, allCountries}
}
