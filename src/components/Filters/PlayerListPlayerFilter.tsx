import { CSSProperties } from "react"
import { Paper, IconButton, InputBase, Divider,  } from "@mui/material"

type PlayerListPlayerFilterProps = {
    searchValue: string,
    handleSearchValueChange: (e: any) => void
}

export default function PlayerListPlayerFilter({ searchValue, handleSearchValueChange}: PlayerListPlayerFilterProps) {

    // const playerFilterContainerStyle: CSSProperties = {
    //     marginRight: 2,
    //     marginLeft: 5,
    // }

    // const playerSearchStyle: CSSProperties = {
    //     minHeight: 25,
    //     outline: 'none',
    //     borderRadius: 3,
    // }



    return(
        <>
            {/* <div className="player-filter" style={playerFilterContainerStyle}>
                <input value={searchValue} placeholder="Search player" onChange={handleSearchValueChange}
                    style={playerSearchStyle}
                />
            </div> */}
            <Paper
                component={"form"}
                sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 400}}
            >
                <InputBase
                    placeholder="Search Player Name"
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
        </>
    )
}