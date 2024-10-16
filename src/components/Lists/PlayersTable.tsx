import { legendIcon, masterIcon } from "../../Data/Icons"
import { charnameToCardIcon } from "../../Data/Icons/Characters/Cards/CharacterCardIcons"
import { charnameToIcon } from "../../Data/Icons/Characters/Unnamed/CharacterUnnamedIcons"
import { countryToIcon } from "../../Data/Icons/Countries/CountryIcons"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"

import { Player } from "../../Data/Types"

import "./PlayersTable.css"

type PlayersTableDataProps = {
    players: Player[],
    selectedCharacter: string | null
}

export default function PlayersTable({ players, selectedCharacter }: PlayersTableDataProps){

    const tableContainerStyle = {
        border: '1px solid rgb(65, 63, 63);',
        borderRadius: 3,
        width: 1000,
        fontSize: 12,
        backgroundColor: '#252527',
        opacity: 0.95,
        marginBottom: 5,
    }

    const tableHeadStyle = {
        color: 'white',
        padding: 2,
    }

    const tableHeadCategories = ["Rank", "Name", "Character", "Country", "League", "MR"]

    return(
        <TableContainer sx={tableContainerStyle} component={Paper}>
            <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                <TableHead>
                    <TableRow sx={{backgroundColor: '#1c1e22', }}>
                        {tableHeadCategories.map((category, idx) => {
                            if(category === "Character" && selectedCharacter)
                                return ""
                            return(<TableCell key={idx} sx={tableHeadStyle} align="center">{category}</TableCell>)
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players? players.map((player, idx) => (
                        <TableRow
                            key={player.Usercode + player.Character}
                        >
                            <TableCell id="rank" sx={{color: 'white',}} component="th" scope="row" align="center">
                                {player.Rank}
                            </TableCell>
                            <TableCell id="cfn" sx={{color: 'white', paddingLeft: 8}} align="left">{player.CFN}</TableCell>
                            {!selectedCharacter &&
                                <TableCell id="character">
                                    <img className="character-icon" src={charnameToIcon[player.Character]} style={{textAlign: 'center'}} />
                                </TableCell>
                            }
                            <TableCell id="country" sx={{color: 'white',}} align="center">
                                <img className="playerCountry" loading="lazy" alt={player.Country} src={countryToIcon[player.Country]} />
                            </TableCell>
                            <TableCell id="league" sx={{color: 'white',}} align="center">
                                {player.League.includes("37")?
                                    <img className="league-icon" src={legendIcon} />
                                    :
                                    <img className="league-icon" src={masterIcon} />
                                }
                            </TableCell>
                            <TableCell id="mr" sx={{color: 'white',}} align="center">{player.MR}</TableCell>
                        </TableRow>
                    )):[]}
                </TableBody>
            </Table>
        </TableContainer>
    )
}