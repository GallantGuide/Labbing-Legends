import { countryToIcon } from "../../Data/Icons"

import React from "react";
import { useState, useEffect } from "react";
import { useRankData } from "../../components/RankDataContainer"
import { useParams, useLocation } from "react-router-dom";
import { Player } from "../../Data/Types";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"

import "./PlayersListPage.css"
import { color } from "highcharts";

function PlayersListPage() {
    const location = useLocation()
    const [playerLimit, setPlayerLimit] = useState(location.state?.playerLimit || 100)
    const [players, setPlayers] = useState<Player[]>()
    const [country, setCountry] = useState<string>()
    
    const { characterToPlayersByMR, playersListByMR } = useRankData({playerLimit})

    const characterName = decodeURIComponent(location.pathname.split("/players/")[1])

    useEffect(() => {
        // console.log(playerLimit)
        if(characterToPlayersByMR && characterName){
            setPlayers(characterToPlayersByMR[characterName])
            // console.log(characterName)
            // console.log(characterToPlayersByMR[characterName])
        }
        else
        {
            setPlayers(playersListByMR)
        }
    }, [characterToPlayersByMR, playersListByMR,])

    const tableContainerStyle = {
        border: '1px solid rgb(65, 63, 63);',
        borderRadius: 3,
        maxWidth: 1000,
        fontSize: 12,
        backgroundColor: '#252527',
        opacity: 0.95,
        marginBottom: 5,
    }

    const tableHeadCategories = ["Rank", "Name", "Country", "League", "MR"]
    const tableHeadStyle = {
        color: 'white',
        padding: 2,
    }

    return(
        <TableContainer sx={tableContainerStyle} component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{backgroundColor: '#1c1e22', }}>
                        {tableHeadCategories.map((category, idx) => {
                            return(<TableCell key={idx} sx={tableHeadStyle} align="center">{category}</TableCell>)
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
                            <TableCell sx={{color: 'white',}} align="left">{player.CFN}</TableCell>
                            <TableCell sx={{color: 'white',}} align="center"><img className="playerCountry" loading="lazy" alt={player.Country} src={countryToIcon[player.Country]} /></TableCell>
                            <TableCell sx={{color: 'white',}} align="center">Legend</TableCell>
                            <TableCell sx={{color: 'white',}} align="center">{player.MR}</TableCell>
                            {/* {<img style={{height: 100, width: 100}} src={LEGEND_ICON}/>} */}
                        </TableRow>
                    )):[]}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PlayersListPage