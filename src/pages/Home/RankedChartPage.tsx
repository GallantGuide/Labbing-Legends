import { useState, useEffect, } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomToggleButton from "../../components/Custom Components/CustomToggleButton"

import "./RankedChartPage.css"

import CountryPlayerCountPanel from "../../components/Panels/CountryPlayerCountPanel";
import { RankedChart } from "../../components/Charts/RankedCharacterChart/RankedChart";
import { RankedChartContextProvider } from "../../components/Charts/RankedCharacterChart/RankedChartContextProvider";
import CustomSelect from "../../components/Custom Components/CustomSelect";

export default function RankedChartPage(){
    const navigate = useNavigate()
    const location = useLocation()

    const [sortCriteria, setSortCriteria] = useState<string>(location.state?.sortCriteria || "Representation")
    const [showMR, setShowMR] = useState<boolean>(location.state?.showMR || true)
    const [playerLimit, setPlayerLimit] = useState<number>(location.state?.playerLimit || 500)

    // Update location state
    useEffect(() => {
        navigate("/", { replace: true, state: {sortCriteria, showMR, playerLimit} })
    }, [sortCriteria, showMR, playerLimit])
    
    const handleSortCriteria = (e:any) => {
        // console.log(e.target.value)
        setSortCriteria(e.target.value)
    }

    const handleShowMRClick = (e: any) => {
        const val = !showMR
        setShowMR(val)
    }

    const handlePlayerLimit = (e: any) => {
        // console.log(e.target.value)
        setPlayerLimit(e.target.value)
    }

    return(
        <div className='Chart'>
            <RankedChartContextProvider {...{playerLimit, showMR, sortCriteria}} >
                <RankedChart/>
            </RankedChartContextProvider>
            <div className="SideBar">
                <CountryPlayerCountPanel playerLimit={playerLimit}/>
                <div className='SortButtons'>
                    {(sortCriteria && sortCriteria === "Representation") &&
                        <CustomToggleButton
                            label="Show MR"
                            selectedValue={showMR}
                            handleClick={handleShowMRClick}
                            sx={{width: 175, padding: '10px 0px', boxSizing: 'border-box', mt: 1}}
                        />
                    }
                    <CustomSelect
                        label={"Sorting Mode"}
                        selectedValue={sortCriteria} options={["Representation", "MR"]}
                        handleChange={handleSortCriteria}
                        defaultValue="Representation"
                        sx={{marginTop: 2, width: 200}}
                    />
                    <CustomSelect
                        label={"Total Player Size"}
                        selectedValue={playerLimit} options={[100,500,1000,2000]}
                        handleChange={handlePlayerLimit}
                        defaultValue={500}
                        sx={{marginTop: 2, width: 200}}
                    />
                </div>
            </div>
        </div>
    )
}
