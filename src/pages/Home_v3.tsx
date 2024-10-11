import React, { useState, useEffect, useRef } from "react";
import { useRankData } from "./RankDataContainer";
import { useNavigate, useLocation } from "react-router-dom";

import { useHighchartsData } from "./HighchartsDataContainer"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Switch from '@mui/material/Switch'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import "./Home.css"

function Home_v3(){
    const navigate = useNavigate()
    const location = useLocation()
    
    const [sortCriteria, setSortCriteria] = useState<string>(location.state?.sortCriteria || "Representation")
    const [showMR, setShowMR] = useState<boolean>(location.state?.showMR || false)
    const [playerLimit, setPlayerLimit] = useState<number>(location.state?.playerLimit || 500)

    const { options } = useHighchartsData({sortCriteria, showMR, playerLimit})

    // Update location state, and add/remove listeners on icons
    useEffect(() => {
        const baseURL = "/Highcharts"
        // const params = new URLSearchParams({
        //     playerLimit: playerLimit.toString(),
        //     sortCriteria: sortCriteria,
        //     showMR: showMR.toString()
        // })
        // const fullURL = `${baseURL}?${params.toString()}`

        navigate(baseURL, { replace: true, state: {sortCriteria, showMR, playerLimit} })
        console.log(location)

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
                // console.log(attrbs["id"].value)
                const charName = attrbs["id"].value

                //  current state values not actually referenced here
                console.log(playerLimit)
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

    return(
        <div className='Chart'>
            <HighchartsReact highcharts={Highcharts} options={options}/>
            <div className='SortButtons'>
                <span style={{color: 'white', }}><Switch checked={showMR} aria-label="Show MR" onChange={handleMRswitch}/>Show MR</span>
                <FormControl>
                    <FormLabel sx={{color: "white"}} id="radio-sorting">Sort Criteria</FormLabel>
                    <RadioGroup
                        aria-labelledby="radio-sorting"
                        name="radio-sort-buttons-group"
                        value={sortCriteria}
                        onChange={handleSortCriteria}
                    >
                        <FormControlLabel sx={{color: "white"}} value={"MR"} control={<Radio />} label={"MR"} />
                        <FormControlLabel sx={{color: "white"}} value={"Representation"} control={<Radio />} label={"Representation"} />
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel sx={{color: "white"}} id="radio-playerLimit">Total Players</FormLabel>
                    <RadioGroup
                        aria-labelledby="radio-playerLimit"
                        name="radio-buttons-group"
                        value={playerLimit}
                        onChange={handlePlayerLimitRadio}
                    >
                        <FormControlLabel sx={{color: "white"}} value={500} control={<Radio />} label={500} />
                        <FormControlLabel sx={{color: "white"}} value={100} control={<Radio />} label={100} />
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    )
}

export default Home_v3