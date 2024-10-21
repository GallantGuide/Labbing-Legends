import { useEffect, useRef, useState } from "react"
import { FormControlLabel, Switch, FormControl, FormLabel, RadioGroup, Radio, Typography } from "@mui/material"

import { tournamentRegions } from "../../Data/StaticData"

import "../Home/RankedChartPage.css"
import { useLocation, useNavigate } from "react-router-dom"
import { TournamentChart } from "../../components/Charts/TournamentCharacterChart/TournamentChart"

export default function TournamentChartPage(){
    const navigate = useNavigate()
    const location = useLocation()

    const [showPlacements, setShowPlacements] = useState<boolean>(location.state?.showPlacements || true)
    const [region, setRegion] = useState<string>(location.state?.region || "")
    const [offlineOnlineStatus, setOfflineOnlineStatus] = useState<string>(location.state?.offlineOnlineStatus || "")
    const [uniquePlayers, setUniquePlayers] = useState<boolean>(false)


    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         navigate("/esports/", { replace: true, state: {region, offlineOnlineStatus, showPlacements}})
    //     }, 300)

    //     return () => clearTimeout(timeoutId)
    // },[region, offlineOnlineStatus, showPlacements])



    const handlePlacementsSwitch = (e: any) => {
        const isChecked = e.target.checked
        isChecked? setShowPlacements(true) : setShowPlacements(false)
    }

    const handleUniquePlayerSwitch = (e: any) => {
        const isChecked = e.target.checked
        isChecked? setUniquePlayers(true) : setUniquePlayers(false)
    }

    const handleRegionFilter = (e: any) => {
        const newRegion = e.target.value

        setRegion((prevRegion) => (prevRegion === newRegion ? "" : newRegion))
    }

    const handleOfflineFilter = (e: any) => {
        const newStatus = e.target.value

        setOfflineOnlineStatus((prevStatus) => (prevStatus === newStatus ? "" : newStatus))
    }

    const formGroupLabelStyle = {color: "white", display: 'flex', fontWeight: 'normal'}
    const radioLabelStyle= {color: "white", fontSize: 13}

    return(
        <div className="Chart">
            <TournamentChart
                showPlacements = {showPlacements}
                uniquePlayers = {uniquePlayers}
                region = {region}
                offlineOnlineStatus = {offlineOnlineStatus}
            />
            <div className="SideBar">
                <div className="SortButtons">
                    <FormControlLabel label="Show Placements" sx={{color: 'white', display: 'flex'}}
                        control={<Switch checked={showPlacements} aria-label="Show Placements" onChange={handlePlacementsSwitch}/>}
                    />
                    <FormControlLabel label="Unique by player" sx={{color: 'white', display: 'flex'}}
                        control={<Switch checked={uniquePlayers} aria-label="Unique by player" onChange={handleUniquePlayerSwitch}/>}
                    />
                    <FormControl>
                        <FormLabel sx={formGroupLabelStyle} id="radio-sorting">Region Filter</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-sorting"
                            name="radio-sort-buttons-group"
                            value={region}
                            onClick={handleRegionFilter}
                        >
                            {tournamentRegions && tournamentRegions.map((region) => {
                                return(
                                    <FormControlLabel key={region} value={region} control={<Radio/>} label={<Typography sx={radioLabelStyle}>{region}</Typography>}/>
                                )
                            })}
                        </RadioGroup>
                        <FormLabel sx={formGroupLabelStyle} id="radio-sorting">Offline/Online Filter</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-sorting"
                            name="radio-sort-buttons-group"
                            value={offlineOnlineStatus}
                            onClick={handleOfflineFilter}
                        >
                            <FormControlLabel value={"Offline"} control={<Radio/>} label={<Typography sx={radioLabelStyle}>{"Offline"}</Typography>}/>
                            <FormControlLabel value={"Online"} control={<Radio/>} label={<Typography sx={radioLabelStyle}>{"Online"}</Typography>}/>
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
        </div>
    )
}