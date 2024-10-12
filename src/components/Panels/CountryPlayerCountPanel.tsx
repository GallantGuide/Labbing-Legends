import { countryToIcon } from "../../Data/Icons";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import useCountryPlayerCountData from "./CountryPlayerCountDataContainer";
import { CountryPlayerCountDataProps } from "../../Data/Types";

import "./CountryPlayerCountPanel.css"

function CountryPlayerCountPanel({ playerLimit }: CountryPlayerCountDataProps) {
    const { countryToPlayerCount } = useCountryPlayerCountData({ playerLimit })

    return(
        <div className="CountryPlayerCountBox">
            {countryToPlayerCount &&
                countryToPlayerCount.map(([country, playerCount], idx) => {
                    let tmp = country
                    switch(tmp){
                        case "Other":
                            tmp = "No Country"
                            break
                        case "No Country":
                            tmp = "Other"
                            break
                    }
                    return(
                        <div key={idx} style={{display: 'flex', marginTop: '5px', marginBottom: '5px'}}>
                            <img className="country-flag" style={{height: '20px', width: '30px'}} loading="lazy" alt={country} src={countryToIcon[tmp]}/>
                            <span style={{marginLeft: '30px'}}>{playerCount}</span>
                            <span style={{marginLeft: 'auto'}}>Players</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CountryPlayerCountPanel