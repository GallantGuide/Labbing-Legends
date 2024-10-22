import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, SxProps, MenuProps, SelectChangeEvent } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useState, useRef } from 'react';

type StyledSelectProps = {
  label: string,
  selectedValue: string | null,
  options: string[],
  handleChange: (e: SelectChangeEvent<string>) => void,
  defaultValue?: string,
  sx?: SxProps
};

export default function StyledSelect({ label, selectedValue, options, handleChange, defaultValue, sx }: StyledSelectProps) {
  const selectRef = useRef(null);
  
  const unfocusedBorderColor = "rgb(65, 63, 63)";
  const focusedBorderColor = "rgb(85, 83, 83)";
  const unfocusedBackgroundColor = "rgb(28,30,34)";
  const focusedBackgroundColor = "rgb(38,40,44)";

  // Common Select and Menu styles
  const selectStyle: SxProps = {
    width: '100%',
    backgroundColor: unfocusedBackgroundColor,
    borderRadius: 3,
    color: 'white',
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: unfocusedBorderColor
      // "fieldset": {
      //   borderColor: unfocusedBorderColor, // Default border color
      // },
      // "&:hover fieldset": {
      //   borderColor: focusedBorderColor, // Hover border color
      // },
      // "&.Mui-focused fieldset": {
      //   borderColor: focusedBorderColor // Border color on focus
      // }
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: focusedBorderColor, // Hover border color
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: focusedBorderColor, // Focus border color
    },
    "&:hover.MuiInputBase-root": {
      // "&:hover": {
        backgroundColor: focusedBackgroundColor
      // },
    },
    "&.Mui-focused.MuiInputBase-root":{
      backgroundColor: focusedBackgroundColor
    },
    "& .MuiOutlinedInput-input":{
      padding: '14px 14px'
    }
  };

  const inputLabelStyle: SxProps = {
    color: 'white',
    "&.MuiInputLabel-root": {
      "&.Mui-focused": {
        color: 'white'
      },
    }
  };

  const menuProps: Partial<MenuProps> = {
    PaperProps: {
      style: {
        maxHeight: 400,
        overflowY: 'auto',
        marginTop: 8,
        backgroundColor: unfocusedBackgroundColor,
        border: `solid 1px ${focusedBorderColor}`,
      }
    }
  };

  const getMenuItemStyles = (option: string) => ({
    backgroundColor: selectedValue === option? focusedBackgroundColor : unfocusedBackgroundColor,
    '&:hover': {
      backgroundColor: focusedBackgroundColor + " !important",
    },
    color: 'white',
    '&.Mui-selected': {
      backgroundColor: focusedBackgroundColor + " !important",  // Enforce hover color on selected
      color: 'white', // Ensure text color is white for selected items
    },
    '&.Mui-selected:hover': {
      backgroundColor: focusedBackgroundColor + " !important", // Ensure selected hover also works
    },
  });

  return (
    <FormControl sx={sx}>
      <InputLabel sx={inputLabelStyle} id={`${label}-label`}>{label}</InputLabel>
      <Select
        sx={selectStyle}
        MenuProps={menuProps}

        labelId={`${label}-label`}
        id={`${label}-select`}
        value={selectedValue || ""}
        onChange={handleChange}
        defaultValue={defaultValue || ""}

        ref={selectRef}

        onClose={() => {
            if(selectRef && selectRef.current)
            {
                selectRef.current.classList.remove('Mui-focused');
                selectRef.current.previousSibling?.classList.remove('Mui-focused');
            }
        }}
        onOpen={() => {
            if(selectRef && selectRef.current){
                selectRef.current.classList?.add('Mui-focused');
                selectRef.current.previousSibling?.classList.add('Mui-focused');
            }
        }}

        IconComponent={() => (<ExpandMore sx={{marginRight: 1}}/>)}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={getMenuItemStyles(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}