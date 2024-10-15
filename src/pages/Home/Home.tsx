import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTopPlayersChartOptions } from "../../components/Charts/TopPlayersChartOptionsContainer";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { Switch, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography } from '@mui/material'

import CountryPlayerCountPanel from "../../components/Panels/CountryPlayerCountPanel";

import { GlobalContext } from "../GlobalProvider";

import "./Home.css"

function Home(){
    const navigate = useNavigate()
    const location = useLocation()

    // const {sortCriteria, setSortCriteria,showMR, setShowMR,playerLimit, setPlayerLimit} = useContext(GlobalContext)
    const [sortCriteria, setSortCriteria] = useState<string>(location.state?.sortCriteria || "Representation")
    const [showMR, setShowMR] = useState<boolean>(location.state?.showMR || false)
    const [playerLimit, setPlayerLimit] = useState<number>(location.state?.playerLimit || 500)

    const { options } = useTopPlayersChartOptions({sortCriteria, showMR, playerLimit})

    // Update location state, and add/remove listeners on icons
    // Potential performance hit by adding listeners everytime states update
    useEffect(() => {
        // Store current states in location.state
        navigate("/", { replace: true, state: {sortCriteria, showMR, playerLimit} })

        const chartContainer = document.querySelector('.highcharts-container')
        if(chartContainer){
            chartContainer.addEventListener('click', handleChartClick)
        }

        return () => {
            if(chartContainer){
                chartContainer.removeEventListener('click', handleChartClick)
            }
        }
    }, [sortCriteria, showMR, playerLimit])

    const handleChartClick = (e: any) => {
        if("attributes" in e.target){
            const attrbs = e.target["attributes"]
            if(attrbs["class"] && attrbs["id"] && attrbs["class"].value == "character-icon"){
                const charName = attrbs["id"].value
                
                // pass state values with navigation to players list page
                navigate(`/players/${charName}`, {state: { sortCriteria, showMR, playerLimit}})
            }
        }
    }

    const handleSortCriteria = (e:any) => {
        // console.log(e.target.value)
        setSortCriteria(e.target.value)
    }

    const handleMRswitch = (e: any) => {
        // console.log(e.target.checked)
        const isChecked = e.target.checked
        if(isChecked)
            setShowMR(true)
        else
            setShowMR(false)
    }

    const handlePlayerLimitRadio = (e: any) => {
        // console.log(e.target.value)
        setPlayerLimit(e.target.value)
    }

    const formGroupLabelStyle = {color: "white", display: 'flex', fontWeight: 'normal'}
    const radioLabelStyle= {color: "white", fontSize: 13}

    return(
        <div className='Chart'>
            <HighchartsReact highcharts={Highcharts} options={options}/>
            <div className="SideBar">
                <CountryPlayerCountPanel playerLimit={playerLimit}/>
                <div className='SortButtons'>
                    <FormControlLabel label="Show MR" sx={{color: 'white', display: 'flex'}}
                        control={<Switch checked={showMR} aria-label="Show MR" onChange={handleMRswitch}/>}
                    />
                    <FormControl>
                        <FormLabel sx={formGroupLabelStyle} id="radio-sorting">Sort Criteria</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-sorting"
                            name="radio-sort-buttons-group"
                            value={sortCriteria}
                            onChange={handleSortCriteria}
                        >
                            <FormControlLabel value={"Representation"} control={<Radio />} label={<Typography sx={radioLabelStyle}>Player Count</Typography>} />
                            <FormControlLabel value={"MR"} control={<Radio />} label={<Typography sx={radioLabelStyle}>Highest MR Player</Typography>} />
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel sx={formGroupLabelStyle} id="radio-playerLimit">Top X Players</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-playerLimit"
                            name="radio-buttons-group"
                            value={playerLimit}
                            onChange={handlePlayerLimitRadio}
                        >
                            <FormControlLabel sx={radioLabelStyle} value={2000} control={<Radio />} label={<Typography sx={radioLabelStyle}>2000</Typography>} />
                            <FormControlLabel sx={radioLabelStyle} value={1000} control={<Radio />} label={<Typography sx={radioLabelStyle}>1000</Typography>} />
                            <FormControlLabel sx={radioLabelStyle} value={500} control={<Radio />} label={<Typography sx={radioLabelStyle}>500</Typography>} />
                            <FormControlLabel sx={radioLabelStyle} value={100} control={<Radio />} label={<Typography sx={radioLabelStyle}>100</Typography>} />
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
        </div>
    )
}

export default Home