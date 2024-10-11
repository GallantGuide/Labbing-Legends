import SOUTHKOREA_ICON from "../assets/countryFlagIcons/southkorea-icon.png"
import CHINA_ICON from "../assets/countryFlagIcons/china-icon.png"
import JAPAN_ICON from "../assets/countryFlagIcons/japan-icon.png"
import NOCOUNTRY_ICON from "../assets/countryFlagIcons/nocountry-icon.png"
import NORWAY_ICON from "../assets/countryFlagIcons/norway-icon.png"
import UK_ICON from "../assets/countryFlagIcons/uk-icon.png"
import HONDURAS_ICON from "../assets/countryFlagIcons/honduras-icon.png"
import USA_ICON from "../assets/countryFlagIcons/usa-icon.png"
import CHILE_ICON from "../assets/countryFlagIcons/chile-icon.png"
import CAMEROON_ICON from "../assets/countryFlagIcons/cameroon-icon.png"
import EGYPT_ICON from "../assets/countryFlagIcons/egypt-icon.png"
import NETHERLANDS_ICON from "../assets/countryFlagIcons/netherlands-icon.png"
import GERMANY_ICON from "../assets/countryFlagIcons/germany-icon.png"
import MACEDONIA_ICON from "../assets/countryFlagIcons/macedonia-icon.png"
import FRANCE_ICON from "../assets/countryFlagIcons/france-icon.png"
import ARMENIA_ICON from "../assets/countryFlagIcons/armenia-icon.png"
import SINGAPORE_ICON from "../assets/countryFlagIcons/singapore-icon.png"
import BRAZIL_ICON from "../assets/countryFlagIcons/brazil-icon.png"
import VENEZUELA_ICON from "../assets/countryFlagIcons/venezuela-icon.png"
import ARGENTINA_ICON from "../assets/countryFlagIcons/argentina-icon.png"
import PERU_ICON from "../assets/countryFlagIcons/peru-icon.png"
import MEXICO_ICON from "../assets/countryFlagIcons/mexico-icon.png"
import DR_ICON from "../assets/countryFlagIcons/dominicanrepublic-icon.png"
import BARBADOS_ICON from "../assets/countryFlagIcons/barbados-icon.png"
import JAMAICA_ICON from "../assets/countryFlagIcons/jamaica-icon.png"
import CANADA_ICON from "../assets/countryFlagIcons/canada-icon.png"

import { useState, useEffect } from "react";
import { useRankData } from "./RankDataContainer"
import { useParams, useLocation } from "react-router-dom";
import { Player } from "./Types";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import LEGEND_ICON from "../assets/legend-icon.png"

import "./PlayerPage.css"

const countryToIcon: Record<string, string> = {
    "South Korea": SOUTHKOREA_ICON,
    "China": CHINA_ICON,
    "Japan": JAPAN_ICON,
    "Other": NOCOUNTRY_ICON,
    "Norway": NORWAY_ICON,
    "United Kingdom": UK_ICON,
    "Honduras": HONDURAS_ICON,
    "United States": USA_ICON,
    "Chile": CHILE_ICON,
    "Cameroon": CAMEROON_ICON,
    "Egypt": EGYPT_ICON,
    "Netherlands": NETHERLANDS_ICON,
    "Germany": GERMANY_ICON,
    "Macedonia": MACEDONIA_ICON,
    "France": FRANCE_ICON,
    "Armenia": ARMENIA_ICON,
    "Singapore": SINGAPORE_ICON,
    "Brazil": BRAZIL_ICON,
    "Venezuela": VENEZUELA_ICON,
    "Argentina": ARGENTINA_ICON,
    "Peru": PERU_ICON,
    "Mexico": MEXICO_ICON,
    "Dominican Republic": DR_ICON,
    "Barbados": BARBADOS_ICON,
    "Jamaica": JAMAICA_ICON,
    "Canada": CANADA_ICON
}

function PlayersPage() {
    const location = useLocation()

    const [playerLimit, setPlayerLimit] = useState(location? location.state["playerLimit"] : 500)
    const [players, setPlayers] = useState<Player[]>()
    const { characterToPlayersByMR } = useRankData({playerLimit})

    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])

    useEffect(() => {
        if(characterToPlayersByMR){
            // console.log(characterToPlayersByMR[characterName])
            setPlayers(characterToPlayersByMR[characterName])
            // console.log(location.pathname)
            // console.log(characterName)
            // console.log(characterToPlayersByMR[characterName])
        }
    }, [characterToPlayersByMR])

    useEffect(() => {
        // console.log(characterName)
        console.log(location.state)
    },[])

    return(
        <TableContainer sx={{maxWidth: 1000, fontSize: 12}} component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Rank</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Country</TableCell>
                        <TableCell align="center">League</TableCell>
                        <TableCell align="center">MR</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players? players.map((player) => (
                        <TableRow
                            key={player.CFN}
                        >
                            <TableCell component="th" scope="row" align="center">
                                {player.Rank}
                            </TableCell>
                            <TableCell align="left">{player.CFN}</TableCell>
                            <TableCell align="center"><img className="playerCountry" alt={player.Country} src={countryToIcon[player.Country]} /></TableCell>
                            <TableCell align="center">Legend</TableCell>
                            <TableCell align="center">{player.MR}</TableCell>
                            {/* {<img style={{height: 100, width: 100}} src={LEGEND_ICON}/>} */}
                        </TableRow>
                    )):[]}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PlayersPage