import { useState, useRef, useEffect, CSSProperties } from "react";
import { useRankData } from "../../components/RankDataContainer"
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Player, TourneyPlayer } from "../../Data/Types";

import "./PlayersListPage.css"
import PlayerListCountryFilter from "../../components/Filters/PlayerListCountryFilter";
import PlayerListPlayerFilter from "../../components/Filters/PlayerListPlayerFilter";
import PlayerListCharacterFilter from "../../components/Filters/PlayerListCharacterFilter";
import PlayerListLengthFilter from "../../components/Filters/PlayerListLengthFilter";
import PlayersTable from "../../components/Lists/PlayersTable";

import { Box, Slider, Stack, styled, Switch, SxProps, Typography, CircularProgress } from "@mui/material";
import { useTournamentData } from "../../components/TournamentDataContainer";

function PlayersListPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false)

    const charFilterContainer = useRef<HTMLFormElement>(null)
    const characterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])

    // Passed states from charts
    const [playerLimit, setPlayerLimit] = useState(location.state?.playerLimit || 100)
    const [pl, setPl] = useState(100)
    const [playerDataType, setPlayerDataType] = useState(location.state?.playerDataType || "ranked")

    const [players, setPlayers] = useState<Player[] | TourneyPlayer[]>([])
    
    // Filters
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(characterName || null)
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [searchValue, setSearchValue] = useState("")
    // Ranked Filters 
    const [phase, setPhase] = useState<number>(5)
    const [phaseDate, setPhaseDate] = useState<Date | null>(null)
    // Tournament Filters
    const [region, setRegion] = useState<string>("")
    const [tournamentType, setTournamentType] = useState<string>("")


    // Data
    const { characterToPlayersByMR, playersListByMR, playerCountries } = useRankData({ playerLimit })
    const { characterToPlayersByPlacement, playerListByEventAndPlacing, tourneyPlayerCountries } = useTournamentData({ region })
    

    useEffect(() => {
        let tmp: Player[] | TourneyPlayer[] = []

        if(playerDataType === "ranked"){
            tmp = selectedCharacter? characterToPlayersByMR[selectedCharacter] : playersListByMR
            if(selectedCountry)
                tmp = tmp.filter((player) => player.Country === selectedCountry)
            if(searchValue != "")
                tmp = tmp.filter((player) => player.CFN.toLowerCase().includes(searchValue.toLowerCase()))
            // Ranked specific filters
        }
        else{ // "tournament"
            tmp = selectedCharacter? characterToPlayersByPlacement[selectedCharacter] : playerListByEventAndPlacing
            if(selectedCountry)
                tmp = tmp.filter((player) => player.Residence === selectedCountry)
            if(searchValue != "")
                tmp = tmp.filter((player) => player.Name.toLowerCase().includes(searchValue.toLowerCase()))
            if(region != "")
                tmp = tmp.filter((player) => player.Region == region)
            if(tournamentType != "")
                tmp = tmp.filter((player) => player.TournamentType == tournamentType)
            // Tournament specific filters
        }
        // console.log(tmp)
        setLoading(false)
        setPlayers(tmp)

        // update URL
        navigate(`/players/${selectedCharacter || ""}`, { replace: true})
        
    }, [characterToPlayersByMR, playersListByMR, selectedCharacter, searchValue, selectedCountry,
        characterToPlayersByPlacement, playerListByEventAndPlacing, region, tournamentType,
        playerDataType])

    // useEffect(() => {
    //     const container = charFilterContainer.current
    //     if(container){
    //         // Function to convert vertical scroll to horizontal
    //         const handleWheelScroll = (event: WheelEvent) => {
    //             if (event.deltaY !== 0) {
    //                 event.preventDefault(); // Prevent the default vertical scroll behavior
    //                 container.scrollLeft += event.deltaY; // Scroll horizontally instead
    //             }
    //         };

    //         container.addEventListener('wheel', handleWheelScroll);

    //         return () => {
    //             container.removeEventListener('wheel', handleWheelScroll);
    //         }
    //     }

    // })

    // useEffect(() => {
    //     if (selectedCharacter && characterRefs.current[selectedCharacter]) {
    //         // console.log(characterRefs.current[selectedCharacter])
    //         console.log(characterRefs.current[selectedCharacter])
    //         characterRefs.current[selectedCharacter]?.scrollIntoView({
    //             behavior: "smooth",
    //             inline: "center", // Center the selected character in the scroll area
    //             block: "center"
    //         })
    //     }
    // }, [selectedCharacter])

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
        if(country === "World")
            setSelectedCountry(null)
        else
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

    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
          '& .MuiSwitch-thumb': {
            width: 15,
          },
          '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
          },
        },
        '& .MuiSwitch-switchBase': {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: '#1890ff',
              ...theme.applyStyles('dark', {
                backgroundColor: '#177ddc',
              }),
            },
          },
        },
        '& .MuiSwitch-thumb': {
          boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
          width: 12,
          height: 12,
          borderRadius: 6,
          transition: theme.transitions.create(['width'], {
            duration: 200,
          }),
        },
        '& .MuiSwitch-track': {
          borderRadius: 16 / 2,
          opacity: 1,
          backgroundColor: 'rgba(0,0,0,.25)',
          boxSizing: 'border-box',
          ...theme.applyStyles('dark', {
            backgroundColor: 'rgba(255,255,255,.35)',
          }),
        },
    }));

    const handleDataTypeSwitch = (e:any) => {
        const isChecked = e.target.checked
        setPlayers([])
        setLoading(true)
        if(isChecked)
            setPlayerDataType("ranked")
        else
            setPlayerDataType("tournament")
    }
    
    return(
        <div className="playerlist-page">
            <div className="filters-and-table">
                <div className="filter-bar" >
                    <PlayerListCountryFilter handleCountryChange={handleCountryChange} allCountries={playerDataType === "ranked"? playerCountries : tourneyPlayerCountries}/>
                    {/* {(playerDataType && playerDataType === "ranked")?
                        <PlayerListLengthFilter playerLimit={playerLimit} pl={pl} handlePlayerCountChange={handlePlayerCountChange} handlePlChange={handlePlChange}/> : ""
                        } */}
                    <PlayerListPlayerFilter handleSearchValueChange={handleSearchValueChange} searchValue={searchValue}/>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginLeft: 1}}>
                        <Typography color="white">T</Typography>
                        <AntSwitch checked={playerDataType === "ranked"} onChange={handleDataTypeSwitch} inputProps={{ 'aria-label': 'ant design' }} />
                        <Typography color="white">R</Typography>
                    </Stack>
                </div>
                <div className="playertable-container">
                    <PlayersTable players={players} selectedCharacter={selectedCharacter} playerDataType={playerDataType}/>
                </div>
            </div>
            <PlayerListCharacterFilter
                charFilterContainer={charFilterContainer} characterRefs={characterRefs}
                selectedCharacter={selectedCharacter}
                handleCharacterRadioGroupChange={handleCharacterRadioGroupChange} handleCharacterRadioGroupClick={handleCharacterRadioGroupClick}
            />
        </div>
    )
}

export default PlayersListPage