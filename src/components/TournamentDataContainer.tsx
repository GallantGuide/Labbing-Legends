import { useEffect, useMemo } from "react"
import esportsData from "../Data/Esport_Data_sort.json"
import { CharacterToTourneyPlayers, StringToNumber, TourneyPlayer } from "../Data/Types"
import { allCharacters } from "../Data/StaticData"

type TournamentDataContainerProps = {
    region?: string,
    offlineOnlineStatus?: string,
    uniquePlayers?: boolean
    tournamentType?: string
}

type CharacterStats = {
    totalCount: number, //number of people playing this character
                  // [top16,  top8,   top3,   top1]
    placementCounts: [number, number, number, number], // number people placing top 16/8/3/1 with this character
    players: TourneyPlayer[], // list of people playing the character
};

export function useTournamentData({ region, offlineOnlineStatus, uniquePlayers, tournamentType }: TournamentDataContainerProps) {
    

    // Create a memoized filtered dataset
    const filteredData = useMemo(() => {
        let data = esportsData
        
        // Apply all filters in a single pass
        if (region || offlineOnlineStatus || uniquePlayers) {
            const seen = uniquePlayers ? new Set<string>() : null
            
            data = data.filter(player => {
                // Check all conditions in one pass
                const regionMatch = (region === "World") || player.Region === region // no region specified then default to true
                const eventMatch = (offlineOnlineStatus === "Both") ||
                    (player.Event.includes("Offline") === (offlineOnlineStatus === "Offline"))
                const tourneyTypeMatch = (tournamentType === "All") || player.TournamentType === tournamentType
                
                // Unique players check
                if (uniquePlayers) {
                    // **IMPORTANT**: Distinguish by name, placement, and character
                    const key = `${player.Name}-${player.Placement}-${player.Character}`
                    if (seen!.has(key)) return false;
                    seen!.add(key);
                }
                
                return regionMatch && eventMatch && tourneyTypeMatch
            });
        }
        
        return data;
    }, [esportsData, region, offlineOnlineStatus, uniquePlayers, tournamentType])

    const charnameToStats = useMemo(() => {
        const stats = new Map<string, CharacterStats>()
        
        // Initialize stats for all characters
        allCharacters.forEach(char => {
            stats.set(char, {
                totalCount: 0,
                placementCounts: [0, 0, 0, 0],
                players: []
            })
        })

        // Single pass through filtered data
        filteredData.forEach(player => {
            const stat = stats.get(player.Character)!
            stat.totalCount++
            stat.players.push(player)
            
            // Update placement counts
            if (player.Placement === 1) stat.placementCounts[3]++
            else if (player.Placement <= 3) stat.placementCounts[2]++
            else if (player.Placement <= 8) stat.placementCounts[1]++
            else if (player.Placement <= 16) stat.placementCounts[0]++
        })

        return stats
    }, [filteredData])

    // Derived data using the pre-computed stats
    const charnamePlayerCountPairs = useMemo(() => 
        Array.from(charnameToStats.entries())
            .map(([char, stats]) => [char, stats.totalCount] as [string, number])
            .sort(([,a], [,b]) => b - a),
        [charnameToStats]
    );

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