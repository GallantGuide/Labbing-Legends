import { useState, useEffect, useMemo } from "react";
import { CharacterToPlayers, StringToNumber, Player, CharacterPlayerCountPairs } from "../Data/Types";

import { allCharacters } from "../Data/StaticData";

import rankData from "../Data/Players10_20_24v2.json"
import { filter } from "echarts/types/src/export/api/util.js";

type RankDataProps = {
    playerLimit?: number
}

type CharacterStats = {
    totalCount: number,
    players: Player[],
    MRintervalCounts: [number, number, number]
}

export function useRankData({ playerLimit }: RankDataProps){

    const filteredData = useMemo((): Player[] => {
        // slice() creates copy
        return rankData.slice(0, playerLimit? playerLimit : 500)
    }, [rankData, playerLimit])

    const charnameToStats = useMemo(() => {
        const stats = new Map<string, CharacterStats>()

        allCharacters.forEach(char => {
            stats.set(char, {
                totalCount: 0,
                players: [],
                MRintervalCounts: [0,0,0]
            })
        })

        filteredData.forEach(player => {
            const stat = stats.get(player.Character)!
            stat.totalCount++
            stat.players.push(player)

            const playerMR = parseInt(player.MR.substring(0, 4), 10)
            if(playerMR >= 2300) stat.MRintervalCounts[2]++
            else if(playerMR >= 2200) stat.MRintervalCounts[1]++
            else stat.MRintervalCounts[0]++
        })
        // console.log(stats)
        return stats

    }, [filteredData])

    const charnamePlayerCountPairs = useMemo(() =>
        Array.from(charnameToStats.entries())
        .map(([char, stats]) => [char, stats.totalCount] as [string, number])
        .sort(([,a], [,b]) => b - a),
    [filteredData])

    const charnameToPlayersByMR = useMemo(() => {
        const result: CharacterToPlayers = {}
        // Already pre-sorted by MR
        charnameToStats.forEach((stats, char) => {
            result[char] = [...stats.players]
        })

        // console.log(result)
        return result
    }, [filteredData])

    return {
        rankData,
        charnamePlayerCountPairs,
        charnameToPlayersByMR,
        charnameToStats,
        playersByMR: filteredData,
        playerCountries: useMemo(() => Array.from(new Set(filteredData.map(p => p.Country))),[filteredData])
    }
}
