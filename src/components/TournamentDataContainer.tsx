import { useEffect, useMemo } from "react"
import esportsData from "../Data/Esport_Data_sort.json"
import { CharacterToTourneyPlayers, StringToNumber, TourneyPlayer } from "../Data/Types"
import { allCharacters } from "../Data/StaticData"

type TournamentDataContainerProps = {
    region?: string,
    offlineOnlineStatus?: string,
    uniquePlayers: boolean
}

export function useTournamentData({ region, offlineOnlineStatus, uniquePlayers }: TournamentDataContainerProps){
    const tournamentPlayerData: TourneyPlayer[] = esportsData

    function getFilteredData() : TourneyPlayer[] {
        //filter by region
        let data: TourneyPlayer[] = region? tournamentPlayerData.filter((player) => player.Region === region) : tournamentPlayerData

        //filter by offline/online
        data = offlineOnlineStatus? data.filter((player) => {
            const eventName = player.Event
            if(eventName.includes("Offline")){
                return (offlineOnlineStatus === "Offline")
            }
            return (offlineOnlineStatus === "Online")
        }) : data

        //filter by unique players
        if(uniquePlayers){
            const seen: Set<string> = new Set()

            data = data.filter((player) =>{
                const playerAndPlacing: string = player.Name + (player.Placement.toString())

                if(!(seen.has(playerAndPlacing))){
                    seen.add(playerAndPlacing)
                    return true
                }
                return false
            })

        }

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

    function getPlayerListByEventAndPlacing(): TourneyPlayer[] {
        const data: TourneyPlayer[] = filteredData
        return data
    }

    function getAllCountries(): string[] {
        const data: TourneyPlayer[] = filteredData
        const seen: Set<string> = new Set()
        const tmp: string[] = []

        data.forEach((player) =>{
            const country = player.Residence
            if(!(seen.has(country))){
                seen.add(country)
                tmp.push(country)
            }
        })

        return tmp.sort()
    }

    function getAllTournamentRegions(): string[] {
        const data: TourneyPlayer[] = filteredData
        const seen: Set<string> = new Set()
        const tmp: string[] = []

        data.forEach((player) =>{
            const region = player.Region
            if(!(seen.has(region))){
                seen.add(region)
                tmp.push(region)
            }
        })

        return tmp
    }
    
    //Helper Data
    const filteredData: TourneyPlayer[] = useMemo(() => getFilteredData(), [tournamentPlayerData, region, offlineOnlineStatus, uniquePlayers])

    //Returned Data
    const playerListByEventAndPlacing: TourneyPlayer[] = useMemo(() => getPlayerListByEventAndPlacing(), [filteredData])
    const characterToPlayerCountPairs: [string, number][] = useMemo(() => getCharacterPlayerCountPairs(), [filteredData])
    const characterToPlayersByPlacement: CharacterToTourneyPlayers = useMemo(() => getCharacterToPlayersByPlacement(), [filteredData])
    const tourneyPlayerCountries: string[] = useMemo(() => getAllCountries(), [filteredData])
    const tourneyRegions: string[] = useMemo(() => getAllTournamentRegions(), [filteredData])

    return { characterToPlayersByPlacement, characterToPlayerCountPairs, playerListByEventAndPlacing, tourneyPlayerCountries, tourneyRegions }
}