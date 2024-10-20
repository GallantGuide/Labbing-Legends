import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, SxProps, SelectProps, MenuProps,  } from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"

import CustomSelect from "../../Data/Custom Components/CustomSelect"

import styled from "@emotion/styled"

type PlayerListCountryFilterProps = {
    selectedCountry: string | null,
    allCountries: string[],
    handleCountryChange: (e: any) => void
}

export function PlayerListCountryFilterSide({ selectedCountry, allCountries, handleCountryChange }: PlayerListCountryFilterProps){

    return(
        <CustomSelect 
            label={"Country"}
            selectedValue={selectedCountry}
            options={["World",...allCountries]}
            handleChange={handleCountryChange}
            defaultValue={"World"}
        />
    )
}