import { useState, useRef, useEffect, CSSProperties } from "react";
import { useRankData } from "../../components/RankedDataContainer"
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Player, TourneyPlayer } from "../../Static/Types"

import "./PlayersListPage.css"
import {PlayerListPlayerFilter} from "../../components/Filters/PlayerListPlayerFilter";
import PlayerListCharacterFilter from "../../components/Filters/PlayerListCharacterFilter";
import {PlayersTable} from "../../components/Lists/PlayersTable";

import { FormControlLabel, Stack, Switch, SxProps, ToggleButton } from "@mui/material";
import { AntSwitch, SwitchTextTrack } from "../../components/Custom Components/CustomStyledComponents";

import { useTournamentData } from "../../components/TournamentDataContainer";
import { tournamentRegions } from "../../Static/StaticData"

import CustomSelect from "../../components/Custom Components/CustomSelect";
import CustomToggleButton from "../../components/Custom Components/CustomToggleButton"

import { charnameToBackgrounds } from "../../Static/Backgrounds/CharacterBackgrounds";

function PlayersListPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false)

    // Refs
    const appRef: HTMLElement | null = document.querySelector('.App')

    const charFilterContainer = useRef<HTMLFormElement>(null)
    const characterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const [playerDataType, setPlayerDataType] = useState(location.state?.playerDataType || "tournament")

    // Displayed table data
    const [players, setPlayers] = useState<Player[] | TourneyPlayer[]>([])
    // Filters
    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(characterName || null)
    const [selectedCountry, setSelectedCountry] = useState<string>("World")
    const [searchValue, setSearchValue] = useState("")
    const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue)
    // Ranked Filters 
    const [phase, setPhase] = useState<number>(5)
    const [phaseDate, setPhaseDate] = useState<Date | null>(null)
    const [playerLimit, setPlayerLimit] = useState(location.state?.playerLimit || 1000)
    // Tournament Filters
    const [region, setRegion] = useState<string>(location.state?.region || "World")
    const [tournamentType, setTournamentType] = useState<string>(location.state?.tournamentType || "All")
    const [offlineOnlineStatus, setOfflineOnlineStatus] = useState<string>(location.state?.offlineOnlineStatus || "Both")
    const [season, setSeason] = useState<string>(location.state?.season || "Two")
    const [uniquePlayers, setUniquePlayers] = useState<boolean>(location.state?.uniquePlayers || false)

    // Data from custom hooks
    const { charnameToPlayersByMR, playersByMR, playerCountries } = useRankData({ playerLimit })
    const { charnameToPlayersByPlacement, playersByEventAndPlacing, tourneyPlayerCountries } = useTournamentData({season, uniquePlayers})

    useEffect(() => {
        // console.log("Filters Effect")
        let tmp: Player[] | TourneyPlayer[] = []
        if(playerDataType === "ranked"){
            tmp = selectedCharacter? charnameToPlayersByMR[selectedCharacter] : playersByMR
            if(selectedCountry && selectedCountry != "World") //FIXME:
                tmp = tmp.filter((player) => player.Country === selectedCountry)
            if(debouncedSearchValue != "")
                tmp = tmp.filter((player) => player.CFN.toLowerCase().includes(debouncedSearchValue.toLowerCase()))
            /* Ranked specific filters */
        }
        else{ // "tournament"
            tmp = selectedCharacter? charnameToPlayersByPlacement[selectedCharacter] : playersByEventAndPlacing
            if(selectedCountry && selectedCountry != "World") //FIXME:
                tmp = tmp.filter((player) => player.Residence === selectedCountry)
            if(debouncedSearchValue != "")
                tmp = tmp.filter((player) => player.Name.toLowerCase().includes(debouncedSearchValue.toLowerCase()))
            /* Tournament specific filters */
            if(region != "" && region != "World")
                tmp = tmp.filter((player) => player.Region == region)
            if(tournamentType != "" && tournamentType != "All")
                tmp = tmp.filter((player) => player.TournamentType == tournamentType)
            if(offlineOnlineStatus != "" && offlineOnlineStatus != "Both")
                tmp = tmp.filter((player) => player.Event.includes(offlineOnlineStatus))
        }
        setPlayers(tmp)

        // update URL
        navigate(`/players/${selectedCharacter || ""}`, { replace: true})
        
    }, [playerLimit,//ranked state triggers
        region, tournamentType, offlineOnlineStatus, season, uniquePlayers, //tournament state triggers
        selectedCharacter, debouncedSearchValue, selectedCountry, //shared filter triggers
        playerDataType])
    
    // Debouncer for player search
    useEffect(() =>{
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue)
          }, 300)
      
          return () => clearTimeout(handler)
    }, [searchValue])

    const updateBackgroundImage = (charName: string) => {
        if(appRef){
            if(!charnameToBackgrounds[charName]){
                appRef.style.backgroundImage = `url(${charnameToBackgrounds["Default"]})`
            }
            else {
                // console.log(appRef);
                // console.log(charnameToBackgrounds[charName]);
                // console.log(charName + " set as background")
                appRef.style.backgroundImage = `url(${charnameToBackgrounds[charName]})`
            }
        }
    }

    useEffect(() => {
        // console.log("Updated bgs Effect")
        if(selectedCharacter){
            updateBackgroundImage(selectedCharacter)
        }
        else{
            updateBackgroundImage("Default")
        }
    },[selectedCharacter])

    
    useEffect(() => {
        // console.log("Preload bgs Effect")
        // Preload backgrounds (big size)
        Object.values(charnameToBackgrounds).forEach((imageUrl) => {
            const img = new Image()
            img.src = imageUrl
        })
        
        // Set background if manual URL with param set by user
        if(selectedCharacter){
            updateBackgroundImage(selectedCharacter)
        }
        else{
            updateBackgroundImage("Default")
        }
        
        // Reset background on dismount (left the page)
        return () => {
            if(appRef)
                appRef.style.backgroundImage = `url(${charnameToBackgrounds["Default"]})`
        }
    },[appRef])

    const handleCharacterRadioGroupChange = (e: any) => {
        const name = e.target.value
        setSelectedCharacter(name)
    }

    const handleCharacterRadioGroupClick = (e: any) => {
        const name = e.target.value
        if(selectedCharacter === name){
            setSelectedCharacter(null)
            setUniquePlayers(false)
        }
    }

    const handleSearchValueChange = (e: any) => {
        const searchInput = e.target.value
        // console.log(searchInput)

        setSearchValue(searchInput)
    }

    const handleCountryChange = (e: any) => {
        // console.log(e.target.value)
        const country = e.target.value

        setSelectedCountry(country)
    }

    const handlePlayerLimitChange = (e: any) => {
        // console.log(newValue  as number)
        // setPlayerLimit(newValue as number)
        const val = e.target.value
        setPlayerLimit(val)
    }

    const handleTournamentTypeChange = (e: any) => {
        const val = e.target.value
        setTournamentType(val)
    }

    const handleRegionChange = (e: any) => {
        const val = e.target.value
        setRegion(val)
    }

    const handleDataTypeSwitch = (e:any) => {
        const isChecked = e.target.checked
        setPlayers([])
        setLoading(true)
        if(isChecked)
            setPlayerDataType("tournament")
        else
            setPlayerDataType("ranked")
    }

    const handleOfflineOnlineChange = (e: any) => {
        const val = e.target.value
        setOfflineOnlineStatus(val)
    }

    const handleSeasonChange = (e:any) => {
        const val = e.target.value
        setSeason(val)
    }

    const handleUniquePlayerClick = (e: any) => {
        const val = !uniquePlayers
        setUniquePlayers(val)
    }

    const sideBarFilterContainerStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
        position: 'absolute', left: 'calc(50% + 500px)', maxWidth: 300, marginLeft: 10, marginTop: 53
    }

    return(
        <div className="playerlist-page">
            <div className="filters-table-container">
                <div className="filter-bar">
                    {selectedCharacter &&
                        <CustomToggleButton
                            label={"Unique Placings"}
                            selectedValue={uniquePlayers}
                            handleClick={handleUniquePlayerClick}
                            sx={{mr: 1,}}
                        />
                    }
                    <div className="inner-filter-bar" >
                        <PlayerListPlayerFilter handleSearchValueChange={handleSearchValueChange} searchValue={searchValue}/>
                        <Stack direction="row" spacing={1} sx={{}}>
                            <SwitchTextTrack checked={playerDataType === "tournament"} onChange={handleDataTypeSwitch} inputProps={{ 'aria-label': 'ant design' }} />
                        </Stack>
                    </div>
                </div>
                <div className="playertable-container">
                    <PlayersTable uniquePlayers={uniquePlayers} season={season} players={players} selectedCharacter={selectedCharacter} playerDataType={playerDataType}/>
                </div>
            </div>
            <div className="sidebar-filters" style={sideBarFilterContainerStyle}>
                {playerDataType === "tournament" &&
                    <>
                        <CustomSelect
                            label={"Season"}
                            selectedValue={season} options={["Two", "One"]}
                            handleChange={handleSeasonChange}
                            defaultValue="Two"
                            sx={{marginTop: 2, width: 240}}
                        />

                        {season === "Two" &&
                            <CustomSelect
                                label={"Offline/Online"}
                                selectedValue={offlineOnlineStatus} options={["Both", "Offline", "Online"]}
                                handleChange={handleOfflineOnlineChange}
                                defaultValue="Both"
                                sx={{marginTop: 2, width: 240}}
                            />
                        }
                        <CustomSelect
                            label={"Tournament Type"}
                            selectedValue={tournamentType} options={season ==="Two"? ["All", "CPT", "EWC", "Tier 1", "Tier 2",] : ["All", "CPT", "Tier 1", "Tier 2",]}
                            handleChange={handleTournamentTypeChange}
                            defaultValue="All"
                            sx={{marginTop: 2, width: 240}}
                        />
                        <CustomSelect
                            label={"Tournament Region"}
                            selectedValue={region} options={["World",...tournamentRegions]}
                            handleChange={handleRegionChange}
                            defaultValue="World"
                            sx={{marginTop: 2, width: 240}}
                        />
                    </>
                }
                {playerDataType === "ranked" &&
                    <>
                        <CustomSelect
                            label={"Total Player Size"}
                            selectedValue={playerLimit}
                            options={[100,500,1000,2000]}
                            handleChange={handlePlayerLimitChange}
                            defaultValue={1000}
                            sx={{marginTop: 2, width: 240}}
                        />
                    </>
                }
                <CustomSelect
                    label={"Country"}
                    selectedValue={selectedCountry}
                    options={["World",...(playerDataType === "ranked"? playerCountries : tourneyPlayerCountries)]}
                    handleChange={handleCountryChange}
                    defaultValue={"World"}
                    sx={{marginTop: 2, width: 240}}
                />
                <PlayerListCharacterFilter
                    charFilterContainer={charFilterContainer} characterRefs={characterRefs}
                    selectedCharacter={selectedCharacter}
                    handleCharacterRadioGroupChange={handleCharacterRadioGroupChange} handleCharacterRadioGroupClick={handleCharacterRadioGroupClick}
                />
            </div>
        </div>
    )
}

export default PlayersListPage