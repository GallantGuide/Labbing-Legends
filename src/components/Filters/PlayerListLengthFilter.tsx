import { SxProps, Box, Slider } from "@mui/material"

type PlayerListLengthFilterProps = {
    playerLimit: number,
    pl: number,
    handlePlayerCountChange: (e: any, newValue: number | number[]) => void
    handlePlChange: (e: any, newValue: number | number[]) => void
}

export default function PlayerListLengthFilter({ playerLimit, pl, handlePlayerCountChange, handlePlChange,}: PlayerListLengthFilterProps){

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
    return(
        <Box className="player-counter-filter" sx={playerCountFilterContainerStyle}>
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
        </Box>
    )
}