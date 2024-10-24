import { SxProps, ToggleButton, } from "@mui/material"

type StyledToggleButtonProps = {
  label: string,
  selectedValue: boolean,
  handleClick: (e: any) => void,
  sx: SxProps,
};

export default function StyledToggleButton({ label, selectedValue, handleClick, sx }: StyledToggleButtonProps) {

    const unfocusedBorderColor = "rgb(65, 63, 63)";
    const focusedBorderColor = "rgb(85, 83, 83)";
    const unfocusedBackgroundColor = "rgb(28,30,34)";
    const focusedBackgroundColor = "rgb(38,40,44)";

    // Common Select and Menu styles

    const toggleButtonStyle: SxProps = {
        // mt: 2,
        fontWeight: 600,
        backgroundColor: unfocusedBackgroundColor,
        borderColor: unfocusedBorderColor,
        borderRadius: 3,
        color: 'white',
        "&.Mui-selected.MuiToggleButton-root": {
            color: 'white',
            backgroundColor: 'rgb(38,90,154)',//'rgb(0,100,255, 1)',
            borderColor: 'rgb(57, 132, 224)',//'rgb(29, 66, 112)'
            "&:hover":{
                backgroundColor: 'rgb(28, 64, 109)',//'rgb(0,100,255, 1)',
                borderColor: 'rgb(38,90,154)',//'rgb(29, 66, 112)' 
            }
        },
        "&:hover.MuiToggleButton-root":{
            backgroundColor: focusedBackgroundColor, //'rgb(0,100,255, 0.75)'
            borderColor: focusedBorderColor
        }
    }

    //.MuiToggleButton-root
    //.Mui-selected

    return (
        <ToggleButton
            id={`${label}-togglebutton`}
            onClick={handleClick}
            sx={{...toggleButtonStyle, ...sx}}
            selected={selectedValue}
            value={selectedValue}
        >
            {label}
        </ToggleButton>
    );
}