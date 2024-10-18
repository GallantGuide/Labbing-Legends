import { useState } from "react"

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

import { useTournamentCharacterChartOptionsContainer } from "../../components/Charts/TournamentCharacterChart/TournamentCharacterChartOptionsContainer"

import { FormControlLabel, Switch, FormControl, FormLabel, RadioGroup, Radio, Typography } from "@mui/material"

import { tournamentRegions } from "../../Data/StaticData"

import "../Home/Home.css"

export default function TournamentChartPage(){
    const [showPlacements, setShowPlacements] = useState<boolean>(false)
    const [region, setRegion] = useState<string>("")
    const [offlineOnlineStatus, setOfflineOnlineStatus] = useState<string>("")

    const { options } = useTournamentCharacterChartOptionsContainer({ showPlacements, region, offlineOnlineStatus })

    const handlePlacementsSwitch = (e: any) => {
        const isChecked = e.target.checked
        isChecked? setShowPlacements(true) : setShowPlacements(false)
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
            <HighchartsReact highcharts={Highcharts} options={options}/>
            <div className="SideBar">
                <div className="SortButtons">
                    <FormControlLabel label="Show Placements" sx={{color: 'white', display: 'flex'}}
                        control={<Switch checked={showPlacements} aria-label="Show Placements" onChange={handlePlacementsSwitch}/>}
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
                                    <FormControlLabel value={region} control={<Radio/>} label={<Typography sx={radioLabelStyle}>{region}</Typography>}/>
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