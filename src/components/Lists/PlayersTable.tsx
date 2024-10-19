import { legendIcon, masterIcon } from "../../Data/Icons"
import { charnameToCardIcon } from "../../Data/Icons/Characters/Cards/CharacterCardIcons"
import { charnameToIcon } from "../../Data/Icons/Characters/Unnamed/CharacterUnnamedIcons"
import { countryToIcon } from "../../Data/Icons/Countries/CountryIcons"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SxProps } from "@mui/material"

import { Player, TourneyPlayer } from "../../Data/Types"

import "./PlayersTable.css"

type PlayersTableDataProps = {
    players: Player[] | TourneyPlayer[],
    selectedCharacter: string | null,
    playerDataType: string
}

export default function PlayersTable({ players, selectedCharacter, playerDataType }: PlayersTableDataProps){

    const tableContainerStyle: SxProps = {
        border: '1px solid rgb(65, 63, 63);',
        borderRadius: 3,
        width: 1000, 
        fontSize: 12,
        backgroundColor: '#252527',
        opacity: 0.95,
        marginBottom: 5,
        
        scrollbarWidth: 'thin',
        

        flexGrow: 1,
        overflowY: 'auto',
    }

    const tableHeadStyle = {
        color: 'white',
        padding: 2,
    }

    const rankedTableHeadCategories = ["Name", "Character", "Country", "League", "MR"]
    const tournamentTableHeadCategories = ["Name", "Character", "Residence", "Tournament", "Tournament Region"]

    // TODO: might need to be state?
    const usingRankedData = playerDataType === "ranked"

    return(
        <TableContainer sx={tableContainerStyle} component={Paper}>
            <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                <TableHead>
                    <TableRow sx={{backgroundColor: '#1c1e22', }}>
                        <TableCell sx={{...tableHeadStyle, width: '50px'}} align="center">{usingRankedData? "Rank" : "Placing"}</TableCell>
                        {(usingRankedData? rankedTableHeadCategories : tournamentTableHeadCategories).map((category, idx) => {
                            if(category === "Character" && selectedCharacter)
                                return ""
                            return(<TableCell key={idx} sx={tableHeadStyle} align="center">{category}</TableCell>)
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players && players.map((player, idx) => {
                        let eventName = ""
                        if(!usingRankedData){
                            eventName = (player as TourneyPlayer).Event
                            // short event names for WW, Offline/Online
                            if(eventName.includes(":")){
                                const i = eventName.indexOf(":")
                                eventName = eventName.substring(i+1)
                            }
                            else if(eventName.includes("Offline Event")){
                                eventName = eventName.substring(14)
                            }
                            else if(eventName.includes("WW")){
                                eventName = "WW " + eventName.substring(23)
                            }
                            eventName = eventName.replace(/"/g, '')
                        }
                        return(
                            (
                                <TableRow
                                    key={idx}
                                >
                                    <TableCell id="rank" sx={{color: 'white',}} component="th" scope="row" align="center">
                                        {usingRankedData? (player as Player).Rank : (player as TourneyPlayer).Placement}
                                    </TableCell>
        
                                    <TableCell id={usingRankedData? 'cfn' : 'name'} sx={{color: 'white', paddingLeft: 8}} align="left">{usingRankedData? (player as Player).CFN : (player as TourneyPlayer).Name}</TableCell>
        
                                    {!selectedCharacter &&
                                        <TableCell id="character" align="center">
                                            <img className="character-icon" src={charnameToIcon[player.Character]} style={{textAlign: 'center'}} />
                                        </TableCell>
                                    }
        
                                    <TableCell id="country" sx={{color: 'white',}} align="center">
                                        <img className="playerCountry" loading="lazy"
                                            alt={usingRankedData? (player as Player).Country : (player as TourneyPlayer).Residence}
                                            src={countryToIcon[usingRankedData? (player as Player).Country : (player as TourneyPlayer).Residence]}
                                        />
                                    </TableCell>
        
                                    {usingRankedData?
                                        <TableCell id="league" sx={{color: 'white',}} align="center">
                                            {(player as Player).League.includes("37")?
                                                <img className="league-icon" src={legendIcon} />
                                                :
                                                <img className="league-icon" src={masterIcon} />
                                            }
                                        </TableCell>
                                        :
                                        <TableCell id="event" sx={{color: 'white',}} align="left">
                                            {eventName}
                                        </TableCell>
                                    }
        
                                    {usingRankedData?
                                        <TableCell id="mr" sx={{color: 'white',}} align="center">{(player as Player).MR}</TableCell>
                                        :
                                        <TableCell id="region" sx={{color: 'white',}} align="center">
                                            {(player as TourneyPlayer).Region}
                                        </TableCell>
                                    }
        
                                </TableRow>
                            )
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}