import { useState, useEffect } from "react";
import { CharacterToPlayers, StringToNumber, Player, PlayerDataList, CharacterPlayerCountPairs } from "./Types";

import ranks from "./Ranksv5.json"

type RankDataProps = {
    playerLimit?: number
}

export function useRankData({ playerLimit }: RankDataProps){
    const [rankData, setRankData] = useState<PlayerDataList>([])
    const [rankMetadata, setRankMetadata] = useState<string[]>([])
    const [characterPlayerCountPairs, setCharacterPlayerCountPairs] = useState<CharacterPlayerCountPairs>([])
    const [characterToPlayersByMR, setCharacterToPlayersByMR] = useState<CharacterToPlayers>({})
    
    useEffect(() => {
        // fetch data from json file (API call in future)
        setRankData(ranks["data"])
        setRankMetadata(ranks["columns"])
    },[])



    useEffect(() => {
        // get transformed data, limited by playerLimit
        if(rankData){
            setCharacterPlayerCountPairs(getCharacterPlayerCountPairs(rankData.slice(0, playerLimit? playerLimit : 500)))
            setCharacterToPlayersByMR(getCharacterToPlayersByMR(rankData.slice(0, playerLimit? playerLimit : 500)))
            // console.log(getCharacterToPlayersByMR(rankData))
        }
    },[rankData, playerLimit])

    function getCharacterPlayerCountPairs(data: PlayerDataList) : CharacterPlayerCountPairs {
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

    function getCharacterToPlayersByMR(data: PlayerDataList) : CharacterToPlayers{
        const tmp: CharacterToPlayers = {}

        for(const player of data){
            const charName = player[4]
            const playerCFN = player[1]
            const playerRank = player[2]
            const playerMR = player[3]
            const userCode = player[5]
            const country = player[6]

            const playerObj: Player = {
                CFN : playerCFN.toString(),
                Rank: playerRank.toString(),
                MR: playerMR.toString(),
                Character: charName.toString(),
                Usercode: userCode.toString(),
                Country: country.toString(),
            }

            if (charName in tmp)
                tmp[charName].push(playerObj)
            else
                tmp[charName] = [playerObj]
        }

        return tmp
    }

    return {rankData, rankMetadata, characterPlayerCountPairs, characterToPlayersByMR}
}
