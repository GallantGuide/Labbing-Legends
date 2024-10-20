import { CSSProperties } from "react"
import { Paper, IconButton, InputBase, Divider, SxProps,  } from "@mui/material"
import React from "react"

type PlayerListPlayerFilterProps = {
    searchValue: string,
    handleSearchValueChange: (e: any) => void
}

export const PlayerListPlayerFilter = React.memo(({ searchValue, handleSearchValueChange}: PlayerListPlayerFilterProps) => {

    // const playerFilterContainerStyle: CSSProperties = {
    //     marginRight: 2,
    //     marginLeft: 5,
    // }

    // const playerSearchStyle: CSSProperties = {
    //     minHeight: 25,
    //     outline: 'none',
    //     borderRadius: 3,
    // }

    const containerStyle: SxProps = {
        display: 'flex',
        alignItems: 'center',
        width: 400,

        p: '1px 8px',
        
        boxSizing: 'border-box',
        borderRadius: 1
    }

    const dividerStyle: SxProps = {
        height: 28, m: 0.5, ml: 'auto'
    }

    return(
        <>
            {/* <div className="player-filter" style={playerFilterContainerStyle}>
                <input value={searchValue} placeholder="Search player" onChange={handleSearchValueChange}
                    style={playerSearchStyle}
                />
            </div> */}
            <Paper
                component={"form"}
                sx={containerStyle}
            >
                <InputBase
                    placeholder="Search Player Name"
                    value={searchValue}
                    onChange={handleSearchValueChange}
                />
                <Divider sx={dividerStyle} orientation="vertical" />
            </Paper>
        </>
    )
})