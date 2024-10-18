import { useEffect, useMemo } from "react"
import esportsData from "../Data/Esport_DataV2.json"
import { CharacterToTourneyPlayers, StringToNumber, TourneyPlayer } from "../Data/Types"
import { allCharacters } from "../Data/StaticData"

type TournamentDataContainerProps = {
    region: string,
    offlineOnlineStatus: string,
}

export function useTournamentData({ region, offlineOnlineStatus }: TournamentDataContainerProps){
    const tournamentPlayerData: TourneyPlayer[] = esportsData

    function getFilteredData() : TourneyPlayer[] {
        let data: TourneyPlayer[] = region? tournamentPlayerData.filter((player) => player.Region === region) : tournamentPlayerData
        data = offlineOnlineStatus? data.filter((player) => {
            const eventName = player.Event
            if(eventName.includes("Offline")){
                return (offlineOnlineStatus === "Offline")
            }
            return (offlineOnlineStatus === "Online")
        }) : data

        return data
    }

    function getCharacterPlayerCountPairs(): [string, number][]{
        const data: TourneyPlayer[] = filteredData
        const tmp: StringToNumber = {}

        data.forEach((player) => {
            const charName = player.Character
            if(charName in tmp)
                tmp[charName]++
            else
                tmp[charName] = 1
        })

        allCharacters.forEach((charName) =>{
            if(!(charName in tmp)){
                tmp[charName] = 0
            }
        })

        return Object.entries(tmp).sort(([,freqA],[,freqB]) => freqB-freqA)
    }

    function getCharacterToPlayersByPlacement(): CharacterToTourneyPlayers {
        const data: TourneyPlayer[] = filteredData
        const tmp: CharacterToTourneyPlayers = {}

        data.forEach((player) => {
            const charName = player.Character

            if(charName in tmp)
                tmp[charName].push(player)
            else
                tmp[charName] = [player]
        })

        allCharacters.forEach((charName) =>{
            if(!(charName in tmp)){
                tmp[charName] = []
            }
        })

        Object.values(tmp).forEach((players) => {
            players.sort((a, b) => a.Placement - b.Placement)
        })

        return tmp
    }
    
    const filteredData: TourneyPlayer[] = useMemo(() => getFilteredData(), [tournamentPlayerData, region, offlineOnlineStatus])
    const characterToPlayerCountPairs: [string, number][] = useMemo(() => getCharacterPlayerCountPairs(), [tournamentPlayerData, region, offlineOnlineStatus])
    const characterToPlayersByPlacement: CharacterToTourneyPlayers = useMemo(() => getCharacterToPlayersByPlacement(), [tournamentPlayerData, region, offlineOnlineStatus])

    return { characterToPlayersByPlacement, characterToPlayerCountPairs }
}