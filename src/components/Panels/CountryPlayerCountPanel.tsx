import { countryToIcon } from "../../Static/Icons/Countries/CountryIcons"; 

import useCountryPlayerCountData from "./CountryPlayerCountDataContainer";
import { CountryPlayerCountDataProps } from "../../Static/Types";

import "./CountryPlayerCountPanel.css"

function CountryPlayerCountPanel({ playerLimit }: CountryPlayerCountDataProps) {
    const { countryToPlayerCount } = useCountryPlayerCountData({ playerLimit })

    return(
        <table className="CountryPlayerCountBox">
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Players</th>
                </tr>
            </thead>
            <tbody>
                {countryToPlayerCount &&
                    countryToPlayerCount.map(([country, playerCount], idx) => {
                        let tmp = country
                        switch(tmp){
                            case "Other":
                                tmp = "Earth"
                                break
                            case "No Country":
                                tmp = "Other"
                                break
                        }
                        const size = (tmp == "Earth")? '25px' : null
                        const imgStyle = {height: size || '20px', width: size || '30px'}
                        const rowStyle = {}
                        return(
                            <tr key={idx} style={rowStyle}>
                                <td style={{textAlign: 'start'}}><img className="country-flag" style={imgStyle} loading="lazy" alt={country} src={countryToIcon[tmp]}/></td>
                                <td style={{textAlign: 'start'}}><span style={{}}>{playerCount}</span></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default CountryPlayerCountPanel