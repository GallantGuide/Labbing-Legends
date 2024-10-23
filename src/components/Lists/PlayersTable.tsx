import { legendIcon, masterIcon } from "../../Data/Icons"
import { charnameToCardIcon } from "../../Data/Icons/Characters/Cards/CharacterCardIcons"
import { charnameToIcon } from "../../Data/Icons/Characters/Unnamed/CharacterUnnamedIcons"
import { countryToIcon } from "../../Data/Icons/Countries/CountryIcons"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SxProps, CircularProgress } from "@mui/material"

import { Player, TourneyPlayer } from "../../Data/Types"

import "./PlayersTable.css"
import { useEffect } from "react"
import React from "react"

type PlayersTableDataProps = {
    players: Player[] | TourneyPlayer[],
    selectedCharacter: string | null,
    playerDataType: string,
    season: string
}

// Always keep this memoized. players prop is too big
export const PlayersTable = React.memo(({ players, selectedCharacter, playerDataType, season }: PlayersTableDataProps) => {

    const tableContainerStyle: SxProps = {
        border: '1px solid rgb(65, 63, 63);',
        borderRadius: 3,
        width: 1000, 
        fontSize: 12,
        backgroundColor: '#252527',
        opacity: 0.95,
        marginBottom: 5,
        
        scrollbarWidth: 'auto',
        

        flexGrow: 1,
        overflowY: 'auto',
    }

    const tableHeadStyle = {
        color: 'white',
        padding: '2 2 2 2',
    }

    const rankedTableHeadCategories = ["Character", "Country", "League", "MR"]
    const tournamentTableHeadCategories = ["Character", "Residence", "Tournament", "Tournament Region"]

    // TODO: might need to be state?
    const usingRankedData = playerDataType === "ranked"

    return(
        <TableContainer sx={tableContainerStyle} component={Paper}>
            <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                {/* {(players && players.length == 0)?
                    <CircularProgress sx={{left: '50%', top: '50%', width: 50, height: 50}} />:""
                } */}
                <TableHead>
                    <TableRow sx={{backgroundColor: '#1c1e22', }}>
                        <TableCell sx={{...tableHeadStyle, width: '50px'}} align="center">{usingRankedData? "Rank" : "Placing"}</TableCell>
                        <TableCell sx={{...tableHeadStyle, paddingLeft: 8}} align="left">Name</TableCell>
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
                        if(!usingRankedData){ //FIXME: Terrible... shouldn't have to do when we get cleaner data
                            eventName = (player as TourneyPlayer).Event
                            // shorten event names for WW, Offline/Online
                            if(season === "Two"){
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
                            }
                            else{
                                if(!eventName.includes("CPT")){
                                    if(eventName.includes(":")){
                                        if(eventName.includes("Offline:  :") || eventName.includes("Offline: :")){
                                            let i = eventName.indexOf(":")
                                            eventName = eventName.substring(i+1)
                                        }
                                        let i = eventName.indexOf(":")
                                        eventName = eventName.substring(i+1)
                                    }
                                }
                                else if(eventName.includes("Offline Event")){
                                    eventName = eventName.substring(14)
                                }
                                else if(eventName.includes("Offline:")){
                                    eventName = eventName.substring(8)
                                }
                                else if(eventName.includes("WW Point Scoring Event")){
                                    eventName = "WW " + eventName.substring(23)
                                }
                            }
                            eventName = eventName.replace(/"/g, ' ')
                            eventName = eventName.replace(/\+/g, ' ')
                        }
                        return(
                            (
                                <TableRow
                                    key={idx}
                                >
                                    <TableCell id="rank" sx={{color: 'white',}} component="th" scope="row" align="center">
                                        {usingRankedData? (player as Player).Rank : (player as TourneyPlayer).Placement}
                                    </TableCell>
        
                                    <TableCell id={usingRankedData? 'cfn' : 'name'} sx={{color: 'white', paddingLeft: 8}} align="left">
                                        {usingRankedData? (player as Player).CFN : (player as TourneyPlayer).Name}
                                    </TableCell>
        
                                    {!selectedCharacter &&
                                        <TableCell id="character" align="center">
                                            <img className="character-icon" loading="lazy" 
                                                title={player.Character}
                                                src={charnameToIcon[player.Character]} 
                                                style={{textAlign: 'center'}} 
                                            />
                                        </TableCell>
                                    }
        
                                    <TableCell id="country" sx={{color: 'white',}} align="center">
                                        <img className="playerCountry" loading="lazy"
                                            title={usingRankedData? (player as Player).Country : (player as TourneyPlayer).Residence}
                                            alt={usingRankedData? (player as Player).Country : (player as TourneyPlayer).Residence}
                                            src={countryToIcon[usingRankedData? (player as Player).Country : (player as TourneyPlayer).Residence]}
                                        />
                                    </TableCell>
        
                                    {usingRankedData?
                                        <TableCell id="league" sx={{color: 'white',}} align="center">
                                            {(player as Player).League.includes("37")?
                                                <img title="Legend" className="league-icon" loading="lazy"  src={legendIcon} />
                                                :
                                                <img title="Master" className="league-icon" loading="lazy"  src={masterIcon} />
                                            }
                                        </TableCell>
                                        :
                                        <TableCell id="event" sx={{color: 'white',}} align="center">
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
})