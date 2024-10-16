import { countryToIcon, charnameToCardIcon } from "../../Data/Icons"

import { useState, useRef, useEffect, CSSProperties } from "react";
import { useRankData } from "../../components/RankDataContainer"
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Player } from "../../Data/Types";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, Select, MenuItem, InputLabel,} from "@mui/material"

import "./PlayersListPage.css"
import useCountryPlayerCountData from "../../components/Panels/CountryPlayerCountDataContainer";

function PlayersListPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const charFilterContainer = useRef<HTMLFormElement>(null)
    const characterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])

    const [playerLimit, setPlayerLimit] = useState(location.state?.playerLimit || 100)
    const [players, setPlayers] = useState<Player[]>()
    const [countries, setCountries] = useState<string>()
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(characterName || null)
    const [searchValue, setSearchValue] = useState("")

    const { characterToPlayersByMR, playersListByMR } = useRankData({playerLimit})

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
            setPlayers(tmp.filter((player) => (player.CFN).toLowerCase().includes(searchValue.toLowerCase())))
        else
            setPlayers([])

        // update URL
        navigate(`/players/${selectedCharacter || ""}`, { replace: true})
        
    }, [characterToPlayersByMR, playersListByMR, selectedCharacter, searchValue])

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
    
    const tableHeadCategories = ["Rank", "Name", "Country", "League", "MR"]
    const tableContainerStyle = {
        border: '1px solid rgb(65, 63, 63);',
        borderRadius: 2,
        maxWidth: 1000,
        fontSize: 12,
        backgroundColor: '#252527',
        opacity: 0.95,
        marginBottom: 5,
    }
    const tableHeadStyle = {
        color: 'white',
        padding: 2,
    }

    
    const characterLabelStyle = (idx: number, isSelected: boolean): CSSProperties => ({
        paddingLeft: idx != 1? 4 : 0,
        filter: !isSelected? 'grayscale(100%)' : 'grayscale(0%)'
    })
    
    const filterBarContainerStyle: CSSProperties = {
        display: 'flex', alignItems: 'center', 
        maxWidth: 1000,maxHeight: 50,
        marginBottom: 10, padding: '5px 6px 5px 8px',
        boxSizing: 'border-box',
        backgroundColor: '#1c1e22', border: '1px solid rgb(65, 63, 63)', borderRadius: 8,
    }

    const characterFilterContainerStyle: CSSProperties = {
        display: 'flex', alignItems: 'center', 
        overflowX: 'hidden', scrollbarWidth: 'thin', whiteSpace: 'nowrap',
    }
    const characterImgStyle: CSSProperties = {
        height: 35, width: 45,
        borderRadius: 4, border: '1px solid black',
        cursor: 'pointer', 
    }

    const playerFilterContainerStyle: CSSProperties = {
        marginRight: 10,
    }

    const playerSearchStyle: CSSProperties = {
        minHeight: 25,
        outline: 'none',
        borderRadius: 3,
    }

    const countryFilterContainerStyle: CSSProperties = {
        marginRight: 10
    }

    const countrySelectStyle: CSSProperties = {
        minWidth: 150, minHeight: 25,
        padding: '0.4em 6em 0.4em 1em',
        cursor: 'pointer', outline: 'none',
        borderRadius: 5, 
    }

    return(
        <div className="playerlist-page" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <div className="filter-bar" style={filterBarContainerStyle}>
                <div className="player-filter" style={playerFilterContainerStyle}>
                    <input value={searchValue} placeholder="Search player" onChange={handleSearchValueChange}
                        style={playerSearchStyle}
                    />
                </div>
                <div className="country-filter" style={countryFilterContainerStyle}>
                    <select className="country-select" style={countrySelectStyle}>
                        {/* {countryToPlayerCount && countryToPlayerCount.map(([country,]) => {
                            return(
                                <option key={country}>
                                    {country}
                                </option>
                            )
                        })} */}
                    </select>
                </div>
                <form className="character-filter" ref={charFilterContainer}
                    style={characterFilterContainerStyle}
                >
                    {Object.keys(charnameToCardIcon).map((charName, idx) => {
                            if(charName == "Random") return ""
                            const isSelected = selectedCharacter === charName
                            return(
                                <div ref={(el) => characterRefs.current[charName] = el} key={idx} style={characterLabelStyle(idx, isSelected)}>
                                    <input type="radio"  id={charName} checked={isSelected} value={charName} onChange={handleCharacterRadioGroupChange} onClick={handleCharacterRadioGroupClick} style={{display: 'none'}}/>
                                    <label htmlFor={charName} style={{display: 'flex'}}>
                                        <img src={charnameToCardIcon[charName]} alt={charName} style={characterImgStyle}/>
                                    </label>
                                </div>
                            )
                    })}
                </form>
            </div>
            <TableContainer sx={tableContainerStyle} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#1c1e22', }}>
                            {tableHeadCategories.map((category, idx) => {
                                return(<TableCell key={idx} sx={tableHeadStyle} align={"center"}>{category}</TableCell>)
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players? players.map((player, idx) => (
                            <TableRow
                                key={player.Usercode + player.Character}
                            >
                                <TableCell sx={{color: 'white',}} component="th" scope="row" align="center">
                                    {player.Rank}
                                </TableCell>
                                <TableCell sx={{color: 'white', paddingLeft: 12}} align="left">{player.CFN}</TableCell>
                                <TableCell sx={{color: 'white',}} align="center"><img className="playerCountry" loading="lazy" alt={player.Country} src={countryToIcon[player.Country]} /></TableCell>
                                <TableCell sx={{color: 'white',}} align="center">{player.League.includes("37")? "Legend" : "Master"}</TableCell>
                                <TableCell sx={{color: 'white',}} align="center">{player.MR}</TableCell>
                                {/* {<img style={{height: 100, width: 100}} src={LEGEND_ICON}/>} */}
                            </TableRow>
                        )):[]}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default PlayersListPage