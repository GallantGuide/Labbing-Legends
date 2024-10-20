import { CSSProperties } from "react"

type PlayerListCountryFilterProps = {
    allCountries: string[],
    handleCountryChange: (e: any) => void
}

export default function PlayerListCountryFilter({ allCountries, handleCountryChange}: PlayerListCountryFilterProps) {

    const countryFilterContainerStyle: CSSProperties = {
        width: 130,
        marginRight: 5
    }

    const countrySelectStyle: CSSProperties = {
        width: 130, minHeight: 25,
        padding: '0.4em 6em 0.4em 1em',
        cursor: 'pointer', outline: 'none',
        borderRadius: 5,
    }

    return(
        <div className="country-filter" style={countryFilterContainerStyle}>
            <select onFocus={() => console.log("focused")} onBlur={() => console.log("blurred")} onChange={handleCountryChange} className="country-select" style={countrySelectStyle}>
                <option value={"World"}>World</option>
                {allCountries && allCountries.map((country) =>{
                    return(
                        <option key={country} value={country}>{country}</option>
                    )
                })}
            </select>
        </div>
    )
}