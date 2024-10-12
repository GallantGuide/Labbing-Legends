import { countryToIcon } from "../../Data/Icons"

import React from "react";
import { useState, useEffect } from "react";
import { useRankData } from "../../components/RankDataContainer"
import { useParams, useLocation } from "react-router-dom";
import { Player } from "../../Data/Types";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import "./PlayersListPage.css"

function PlayersListPage() {
    const location = useLocation()

    const [playerLimit, setPlayerLimit] = useState(location? location.state["playerLimit"] : 500)
    const [players, setPlayers] = useState<Player[]>()
    const { characterToPlayersByMR } = useRankData({playerLimit})

    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])

    useEffect(() => {
        if(characterToPlayersByMR){
            setPlayers(characterToPlayersByMR[characterName])
        }
    }, [characterToPlayersByMR])

    useEffect(() => {
        // console.log(characterName)
        // console.log(location.state)
    },[])

    return(
        <TableContainer sx={{maxWidth: 1000, fontSize: 12, backgroundColor: 'white', opacity: 0.85}} component={Paper}>
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
                            <TableCell align="center"><img className="playerCountry" loading="lazy" alt={player.Country} src={countryToIcon[player.Country]} /></TableCell>
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

export default PlayersListPage