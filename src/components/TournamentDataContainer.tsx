import { useEffect, useMemo } from "react"
import tournamentDataSeason2 from "../Data/Esport_Data_season2v2.json"
import tournamentDataSeason1 from "../Data/Esport_Data_season1v2.json"
import { CharacterToTourneyPlayers, StringToNumber, TourneyPlayer } from "../Static/Types"
import { allCharacters, allCharactersSeason1 } from "../Static/StaticData"

type TournamentDataContainerProps = {
    region?: string,
    offlineOnlineStatus?: string,
    uniquePlayers?: boolean,
    tournamentType?: string,
    season?: string,
}

type CharacterStats = {
    totalCount: number, //number of people playing this character
                  // [top16,  top8,   top3,   top1]
    placementCounts: [number, number, number, number], // number people placing top 16/8/3/1 with this character
    players: TourneyPlayer[], // list of people playing the character
};

export function useTournamentData({ region, offlineOnlineStatus, uniquePlayers, tournamentType, season }: TournamentDataContainerProps) {
    // Create a memoized filtered dataset
    const filteredData = useMemo(() => {
        let data = (season==="One")? tournamentDataSeason1 : tournamentDataSeason2
        
        // Apply all filters in a single pass
        if (region || offlineOnlineStatus || tournamentType) {
            
            
            data = data.filter(player => {
                // Check all conditions in one pass
                const regionMatch = (region === "World") || player.Region === region // no region specified then default to true
                const eventMatch = (offlineOnlineStatus === "Both") ||
                    (player.Event.includes("Offline") === (offlineOnlineStatus === "Offline"))
                const tourneyTypeMatch = (tournamentType === "All") || player.TournamentType === tournamentType
                
                return regionMatch && eventMatch && tourneyTypeMatch
            })
        }

        // IMPORTANT: **Unique player filter must occur after other filters**
        if(uniquePlayers){
            const seen = new Set<string>()
            data = data.filter(player => {
                // Unique players check
                // **IMPORTANT**: Distinguish by name, placement, and character
                const key = `${player.Name}-${player.Placement}-${player.Character}`
                if (!(seen.has(key))){
                    seen.add(key)
                    console.log("added")
                    return true
                }
                return false
            })
        }
        // console.log(data)
        
        return data;
    }, [tournamentDataSeason2, tournamentDataSeason1, season,
        region, offlineOnlineStatus, tournamentType,
        uniquePlayers,])

    const charnameToStats = useMemo(() => {
        const stats = new Map<string, CharacterStats>()
        
        // Initialize stats for all characters
        if(season === "Two"){
            allCharacters.forEach(char => {
                stats.set(char, {
                    totalCount: 0,
                    placementCounts: [0, 0, 0, 0],
                    players: []
                })
            })
        }
        else{
            allCharactersSeason1.forEach(char => {
                stats.set(char, {
                    totalCount: 0,
                    placementCounts: [0, 0, 0, 0],
                    players: []
                })
            })
        }

        // Single pass through filtered data
        filteredData.forEach(player => {
            // console.log(player)
            const stat = stats.get(player.Character)!
            // console.log(stat)
            stat.totalCount++
            stat.players.push(player)
            
            // Update placement counts
            if (player.Placement === 1) stat.placementCounts[3]++
            else if (player.Placement <= 3) stat.placementCounts[2]++
            else if (player.Placement <= 8) stat.placementCounts[1]++
            else if (player.Placement <= 16) stat.placementCounts[0]++
        })
        // console.log(Array.from(stats.entries()))
        return stats
    }, [filteredData])

    // Derived data using the pre-computed stats
    const charnamePlayerCountPairs = useMemo(() => 
        Array.from(charnameToStats.entries())
            .map(([char, stats]) => [char, stats.totalCount] as [string, number])
            .sort(([,a], [,b]) => b - a),
    [charnameToStats])

    const charnameToPlayersByPlacement = useMemo(() => {
        const result: CharacterToTourneyPlayers = {}
        charnameToStats.forEach((stats, char) => {
            result[char] = [...stats.players].sort((a, b) => a.Placement - b.Placement)
        })
        return result
    }, [charnameToStats])

    return {
        charnameToStats,
        charnameToPlayersByPlacement,
        charnamePlayerCountPairs,
        playersByEventAndPlacing: filteredData,
        tourneyPlayerCountries: useMemo(() => Array.from(new Set(filteredData.map(p => p.Residence))).sort(),[filteredData]),
        tourneyRegions: useMemo(() => Array.from(new Set(filteredData.map(p => p.Region))),[filteredData])
    };
}