import { useState, useEffect, useMemo } from "react";
import { useRankData } from "../RankedDataContainer";
import { CountryPlayerCountPairs, StringToNumber, CountryPlayerCountDataProps } from "../../Static/Types";

function useCountryPlayerCountData({ playerLimit }: CountryPlayerCountDataProps) {
    const { charnameToPlayersByMR } = useRankData({ playerLimit })

    const countryToPlayerCount: CountryPlayerCountPairs = useMemo(() => {
        const countryToPlayerCount: StringToNumber = {}
        const seenUsercodes = new Set<string>()

        // get player count per country (disregard those with multiple characters in data set)
        for(const players of Object.values(charnameToPlayersByMR)){
            players.forEach((player) => {
                const country: string = player["Country"]
                const userCode: string = player["Usercode"]

                if(!(seenUsercodes.has(userCode))){
                    seenUsercodes.add(userCode)
                    if(country in countryToPlayerCount){
                        countryToPlayerCount[country] ++
                    }
                    else{
                        countryToPlayerCount[country] = 1
                    }
                }
            })
        }
        // console.log(Object.values(countryToPlayerCount).reduce((acc, val) => acc + val, 0))
        // console.log(Object.entries(countryToPlayerCount))


        /**
         * "Other" originally represented player count without a country flag
         * "Other" now represents the sum of player counts
         * for those countries with <= 5 players
         * "No Country" represents player count without a country flag
         */
        countryToPlayerCount["No Country"] = countryToPlayerCount["Other"]
        delete countryToPlayerCount["Other"]
        let otherPlayerCount = 0
        for(const [country, playerCount] of Object.entries(countryToPlayerCount)){
            if(country != "Other" && playerCount <= 10){
                otherPlayerCount += playerCount
                delete countryToPlayerCount[country]
            }
        }

        // sort countries by player count (descending)
        const sortedCountries =  Object.entries(countryToPlayerCount).sort(([, countA], [, countB]) => countB-countA)
        sortedCountries.push(["Other", otherPlayerCount])

        return sortedCountries
    }, [charnameToPlayersByMR])


    return { countryToPlayerCount }
}

export default useCountryPlayerCountData