import { useState, useRef, useEffect, CSSProperties } from "react";
import { useRankData } from "../../components/RankDataContainer"
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Player, TourneyPlayer } from "../../Data/Types";

import "./PlayersListPage.css"
import PlayerListPlayerFilter from "../../components/Filters/PlayerListPlayerFilter";
import PlayerListCharacterFilter from "../../components/Filters/PlayerListCharacterFilter";
import PlayersTable from "../../components/Lists/PlayersTable";

import { Stack,} from "@mui/material";
import { AntSwitch, SwitchTextTrack } from "../../Data/Custom Components/CustomStyledComponents";

import { useTournamentData } from "../../components/TournamentDataContainer";
import { tournamentRegions } from "../../Data/StaticData";
import { PlayerListCountryFilterSide } from "../../components/Filters/PlayerListCountryFilterSide";
import CustomSelect from "../../Data/Custom Components/CustomSelect";

function PlayersListPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false)

    // Refs
    const charFilterContainer = useRef<HTMLFormElement>(null)
    const characterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    // Passed states from charts
    const [playerLimit, setPlayerLimit] = useState(location.state?.playerLimit || 1000)
    const [pl, setPl] = useState(100)
    const [playerDataType, setPlayerDataType] = useState(location.state?.playerDataType || "ranked")
    // Displayed table data
    const [players, setPlayers] = useState<Player[] | TourneyPlayer[]>([])
    // Filters
    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(characterName || null)
    const [selectedCountry, setSelectedCountry] = useState<string>("World")
    const [searchValue, setSearchValue] = useState("")
    // Ranked Filters 
    const [phase, setPhase] = useState<number>(5)
    const [phaseDate, setPhaseDate] = useState<Date | null>(null)
    // Tournament Filters
    const [region, setRegion] = useState<string>("World")
    const [tournamentType, setTournamentType] = useState<string>("All")
    // Data from custom hooks
    const { characterToPlayersByMR, playersListByMR, playerCountries } = useRankData({ playerLimit })
    const { characterToPlayersByPlacement, playerListByEventAndPlacing, tourneyPlayerCountries } = useTournamentData({})
    

    useEffect(() => {
        let tmp: Player[] | TourneyPlayer[] = []

        if(playerDataType === "ranked"){
            tmp = selectedCharacter? characterToPlayersByMR[selectedCharacter] : playersListByMR
            if(selectedCountry && selectedCountry != "World") //FIXME: 
                tmp = tmp.filter((player) => player.Country === selectedCountry)
            if(searchValue != "")
                tmp = tmp.filter((player) => player.CFN.toLowerCase().includes(searchValue.toLowerCase()))
            /* Ranked specific filters */
        }
        else{ // "tournament"
            tmp = selectedCharacter? characterToPlayersByPlacement[selectedCharacter] : playerListByEventAndPlacing
            if(selectedCountry && selectedCountry != "World") //FIXME: 
                tmp = tmp.filter((player) => player.Residence === selectedCountry)
            if(searchValue != "")
                tmp = tmp.filter((player) => player.Name.toLowerCase().includes(searchValue.toLowerCase()))
            /* Tournament specific filters */
            if(region != "" && region != "World")
                tmp = tmp.filter((player) => player.Region == region)
            if(tournamentType != "" && tournamentType != "All")
                tmp = tmp.filter((player) => player.TournamentType == tournamentType)
        }
        setPlayers(tmp)

        // update URL
        navigate(`/players/${selectedCharacter || ""}`, { replace: true})
        
    }, [//ranked state triggers
        region, tournamentType, //tournament state triggers
        selectedCharacter, searchValue, selectedCountry, //shared filter triggers
        playerDataType])

    const handleCharacterRadioGroupChange = (e: any) => {
        const name = e.target.value
        // console.log(name)
        setSelectedCharacter(name)
    }

    const handleCharacterRadioGroupClick = (e: any) => {
        const name = e.target.value
        if(selectedCharacter === name)
        {
            setSelectedCharacter(null)
            // console.log("selection is now all characters")
        }
    }

    const handleSearchValueChange = (e: any) => {
        const searchInput = e.target.value
        console.log(searchInput)

        setSearchValue(searchInput)
    }

    const handleCountryChange = (e: any) => {
        console.log(e.target.value)
        const country = e.target.value

        setSelectedCountry(country)
    }

    const handlePlayerCountChange = (e: any, newValue: number | number[]) => {
        // console.log(newValue  as number)
        setPlayerLimit(newValue as number)
    }

    const handlePlChange = (e: any, newValue: number | number[]) => {
        // console.log(newValue  as number)
        setPl(newValue as number)
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
            setPlayerDataType("ranked")
        else
            setPlayerDataType("tournament") 
    }

    const selectFilterContainerStyle: CSSProperties = {
        width: 100,
        marginRight: 5
    }

    const selectStyle: CSSProperties = {
        width: 100, minHeight: 25,
        padding: '0.4em 6em 0.4em 1em',
        cursor: 'pointer', outline: 'none',
        borderRadius: 5,
    }

    const sideBarFilterContainerStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        position: 'absolute', left: 'calc(50% + 500px)', maxWidth: 300, marginLeft: 10
    }

    return(
        <div className="playerlist-page">
            <div className="filters-table-container">
                <div className="filter-bar" >
                    <PlayerListPlayerFilter handleSearchValueChange={handleSearchValueChange} searchValue={searchValue}/>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginLeft: 'auto',}}>
                        <SwitchTextTrack checked={playerDataType === "ranked"} onChange={handleDataTypeSwitch} inputProps={{ 'aria-label': 'ant design' }} />
                    </Stack>
                </div>
                <div className="playertable-container">
                    <PlayersTable players={players} selectedCharacter={selectedCharacter} playerDataType={playerDataType}/>
                </div>
            </div>
            <div className="sidebar-filters" style={sideBarFilterContainerStyle}>
                <PlayerListCharacterFilter
                    charFilterContainer={charFilterContainer} characterRefs={characterRefs}
                    selectedCharacter={selectedCharacter}
                    handleCharacterRadioGroupChange={handleCharacterRadioGroupChange} handleCharacterRadioGroupClick={handleCharacterRadioGroupClick}
                />
                <PlayerListCountryFilterSide
                    selectedCountry={selectedCountry} handleCountryChange={handleCountryChange}
                    allCountries={playerDataType === "ranked"? playerCountries : tourneyPlayerCountries}
                />
                {playerDataType === "tournament" &&
                    <>
                        <CustomSelect
                            label={"Region"}
                            selectedValue={region} options={["World",...tournamentRegions]}
                            handleChange={handleRegionChange}
                            defaultValue="World"
                        />
                        <CustomSelect
                            label={"Event Type"}
                            selectedValue={tournamentType} options={["All", "Tier 1", "Tier 2", "CPT", "EWC Qualifier"]}
                            handleChange={handleTournamentTypeChange}
                            defaultValue="All"
                        />
                    </>
                }
            </div>
        </div>
    )
}

export default PlayersListPage