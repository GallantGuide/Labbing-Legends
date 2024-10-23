import { useEffect, useRef, useState } from "react"
import { FormControlLabel, Switch, FormControl, FormLabel, RadioGroup, Radio, Typography } from "@mui/material"

import { tournamentRegions } from "../../Data/StaticData"

import "./TournamentChartPage.css"
import { useLocation, useNavigate } from "react-router-dom"
import { TournamentChart } from "../../components/Charts/TournamentCharacterChart/TournamentChart"

import CustomSelect from "../../components/Custom Components/CustomSelect"

import { TournamentChartContextProvider } from "../../components/Charts/TournamentCharacterChart/TournamentChartContextProvider"

export default function TournamentChartPage(){
    const navigate = useNavigate()
    const location = useLocation()

    const [showPlacements, setShowPlacements] = useState<boolean>(location.state?.showPlacements || true)
    const [uniquePlayers, setUniquePlayers] = useState<boolean>(false)
    const [showChampions, setShowChampions] = useState<boolean>(false)

    const [region, setRegion] = useState<string>(location.state?.region || "World")
    const [offlineOnlineStatus, setOfflineOnlineStatus] = useState<string>(location.state?.offlineOnlineStatus || "Both")
    const [tournamentType, setTournamentType] = useState<string>("All")
    const [season, setSeason] = useState<string>("Two")

    useEffect(() => {
        // const timeoutId = setTimeout(() => {
            navigate("/esports/", { replace: true, state: {region, offlineOnlineStatus, showPlacements}})
        // }, 300)

        // return () => clearTimeout(timeoutId)
    },[region, offlineOnlineStatus, showPlacements, uniquePlayers])

    const handlePlacementsSwitch = (e: any) => {
        const isChecked = e.target.checked
        isChecked? setShowPlacements(true) : setShowPlacements(false)
    }

    const handleUniquePlayerSwitch = (e: any) => {
        const isChecked = e.target.checked
        isChecked? setUniquePlayers(true) : setUniquePlayers(false)
    }

    const handleShowChampionsSwitch = (e: any) => {
        const isChecked = e.target.checked
        isChecked? setShowChampions(true) : setShowChampions(false)
    }

    const handleRegionChange = (e: any) => {
        const val = e.target.value
        setRegion(val)
    }

    const handleOfflineOnlineChange = (e: any) => {
        const val = e.target.value
        setOfflineOnlineStatus(val)
    }

    const handleTournamentTypeChange = (e: any) => {
        const val = e.target.value
        setTournamentType(val)
    }

    const handleSeasonChange = (e: any) => {
        const val = e.target.value
        //FIXME:
        setOfflineOnlineStatus("Both")
        setSeason(val)
    }

    return(
        <div className="tournament-chart">
            <TournamentChartContextProvider {...{showPlacements, showChampions, uniquePlayers, region, offlineOnlineStatus, tournamentType, season}}>
                <TournamentChart/>
            </TournamentChartContextProvider>
            <div className="tournament-chart-sidebar">
                <CustomSelect
                    label={"Season"}
                    selectedValue={season} options={["One", "Two"]}
                    handleChange={handleSeasonChange}
                    defaultValue="Two"
                    sx={{marginTop: 2, mb: 'auto', width: 200}}
                />
                <div className="tournament-chart-sidebar-filters">
                    {!showChampions &&
                        <FormControlLabel label="Show Placements" sx={{color: 'white', display: 'flex'}}
                            control={<Switch checked={showPlacements} aria-label="Show Placements" onChange={handlePlacementsSwitch}/>}
                        />
                    }
                    <FormControlLabel label="Show Champions" sx={{color: 'white', display: 'flex'}}
                        control={<Switch checked={showChampions} aria-label="Show Champions" onChange={handleShowChampionsSwitch}/>}
                    />
                    <FormControlLabel label="Unique by player" sx={{color: 'white', display: 'flex'}}
                        control={<Switch checked={uniquePlayers} aria-label="Unique by player" onChange={handleUniquePlayerSwitch}/>}
                    />
                    {season === "Two" &&
                        <CustomSelect
                            label={"Offline/Online"}
                            selectedValue={offlineOnlineStatus} options={["Both", "Offline", "Online"]}
                            handleChange={handleOfflineOnlineChange}
                            defaultValue="Both"
                            sx={{marginTop: 2, width: 200}}
                        />
                    }
                    <CustomSelect
                        label={"Tournament Type"}
                        selectedValue={tournamentType} options={season === "Two"? ["All", "CPT", "EWC", "Tier 1", "Tier 2",] : ["All", "CPT", "Tier 1", "Tier 2",]}
                        handleChange={handleTournamentTypeChange}
                        defaultValue="All"
                        sx={{marginTop: 2, width: 200}}
                    />
                    <CustomSelect
                        label={"Tournament Region"}
                        selectedValue={region} options={["World",...tournamentRegions]}
                        handleChange={handleRegionChange}
                        defaultValue="World"
                        sx={{marginTop: 2, width: 200}}
                    />
                    
                </div>
            </div>
        </div>
    )
}