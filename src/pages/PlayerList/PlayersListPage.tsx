import { useState, useRef, useEffect, CSSProperties } from "react";
import { useRankData } from "../../components/RankDataContainer"
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Player } from "../../Data/Types";

import "./PlayersListPage.css"
import PlayerListCountryFilter from "../../components/Filters/PlayerListCountryFilter";
import PlayerListPlayerFilter from "../../components/Filters/PlayerListPlayerFilter";
import PlayerListCharacterFilter from "../../components/Filters/PlayerListCharacterFilter";
import PlayersTable from "../../components/Lists/PlayersTable";

import { Box, Slider, SxProps } from "@mui/material";

function PlayersListPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const charFilterContainer = useRef<HTMLFormElement>(null)
    const characterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])

    const [playerLimit, setPlayerLimit] = useState(location.state?.playerLimit || 100)
    //TODO: problem is playerLimit
    const { characterToPlayersByMR, playersListByMR, allCountries } = useRankData({playerLimit})
    const [players, setPlayers] = useState<Player[]>([])
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(characterName || null)
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [searchValue, setSearchValue] = useState("")
    const [pl, setPl] = useState(100)


    useEffect(() => {
        // console.log(selectedCharacter)
        // console.log(playerLimit)
        let tmp: Player[] = []
        if(characterToPlayersByMR && selectedCharacter){
            tmp = characterToPlayersByMR[selectedCharacter]
        }
        else if(playersListByMR)
        {
            tmp = playersListByMR
        }
        // console.log(tmp)
        if(tmp)
            setPlayers(tmp.filter((player) => ((player.CFN).toLowerCase().includes(searchValue.toLowerCase()) && (selectedCountry? player.Country === selectedCountry : true))))
            
        else
            setPlayers([])

        // update URL
        navigate(`/players/${selectedCharacter || ""}`, { replace: true})
        
    }, [characterToPlayersByMR, playersListByMR, selectedCharacter, searchValue, selectedCountry])

    useEffect(() => {
        const container = charFilterContainer.current
        if(container){
            // Function to convert vertical scroll to horizontal
            const handleWheelScroll = (event: WheelEvent) => {
                if (event.deltaY !== 0) {
                    event.preventDefault(); // Prevent the default vertical scroll behavior
                    container.scrollLeft += event.deltaY; // Scroll horizontally instead
                }
            };

            container.addEventListener('wheel', handleWheelScroll);

            return () => {
                container.removeEventListener('wheel', handleWheelScroll);
            }
        }

    })

    useEffect(() => {
        if (selectedCharacter && characterRefs.current[selectedCharacter]) {
            // console.log(characterRefs.current[selectedCharacter])
            console.log(characterRefs.current[selectedCharacter])
            characterRefs.current[selectedCharacter]?.scrollIntoView({
                behavior: "smooth",
                inline: "center", // Center the selected character in the scroll area
                block: "center"
            })
        }
    }, [selectedCharacter])

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
    
    const filterBarContainerStyle: CSSProperties = {
        display: 'flex', alignItems: 'center',
        maxWidth: 1000, maxHeight: 50,
        marginBottom: 10, padding: '5px 6px 5px 8px',
        boxSizing: 'border-box',
        backgroundColor: '#1c1e22', border: '1px solid rgb(65, 63, 63)', borderRadius: 8,
    }

    const playerCountSliderMarks = [
        {
            value: 0,
        },
        {
            value: 100,
        },
        {
            value: 500,
        },
        {
            value: 1000,
        },
        {
            value: 2000,
        },
    ]

    const playerCountFilterContainerStyle: SxProps = {
        marginRight: '10px',
        padding: '0px 10px',
        width: 300,
    }

    const playerCountSliderStyle: SxProps = {

    }

    const playerListPageStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', 
        height: '100vh', overflow: 'hidden'
    }

    return(
        <div className="playerlist-page" style={playerListPageStyle}>
            <div className="filter-bar" style={filterBarContainerStyle}>
                <PlayerListPlayerFilter handleSearchValueChange={handleSearchValueChange} searchValue={searchValue}/>
                <PlayerListCountryFilter handleCountryChange={handleCountryChange} allCountries={allCountries}/>
                {/* <Box className="player-counter-filter" sx={playerCountFilterContainerStyle}>
                    <Slider
                        value={playerLimit}
                        step={null}
                        min={100}
                        max={2000}
                        // onChangeCommitted={handlePlayerCountChange}
                        onChange={handlePlayerCountChange}
                        valueLabelDisplay="auto"
                        marks={playerCountSliderMarks}
                    />
                </Box> */}
                <PlayerListCharacterFilter
                    charFilterContainer={charFilterContainer} characterRefs={characterRefs}
                    selectedCharacter={selectedCharacter}
                    handleCharacterRadioGroupChange={handleCharacterRadioGroupChange} handleCharacterRadioGroupClick={handleCharacterRadioGroupClick}
                />
            </div>
            <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column', overflow: 'hidden', width: '100%', maxWidth: 1140, margin: '0px auto'}}>
                <PlayersTable players={players} selectedCharacter={selectedCharacter}/>
            </div>
        </div>
    )
}

export default PlayersListPage