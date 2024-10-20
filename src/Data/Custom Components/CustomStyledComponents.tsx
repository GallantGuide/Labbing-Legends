import { Box, Slider, Stack, styled, Switch, switchClasses, SxProps, Typography, CircularProgress } from "@mui/material";


export const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
    '& .MuiSwitch-thumb': {
        width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
    },
    },
    '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1890ff',
        ...theme.applyStyles('dark', {
            backgroundColor: '#177ddc',
        }),
        },
    },
    },
    '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
        duration: 200,
    }),
    },
    '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255,255,255,.35)',
    }),
    },
}))

export const SwitchTextTrack = styled(Switch)({
    width: 80,
    height: 48,
    padding: 8,
    [`& .${switchClasses.switchBase}`]: {
      padding: 11,
      color: "#ff6a00",
    },
    [`& .${switchClasses.thumb}`]: {
      width: 26,
      height: 26,
      backgroundColor: "#fff",
    },
    [`& .${switchClasses.track}`]: {
      background: "linear-gradient(to right, #ee0979, #ff6a00)",
      opacity: "1 !important",
      borderRadius: 20,
      position: "relative",
      "&:before, &:after": {
        display: "inline-block",
        position: "absolute",
        top: "50%",
        width: "50%",
        transform: "translateY(-50%)",
        color: "#fff",
        textAlign: "center",
        fontSize: "0.75rem",
        fontWeight: 500,
      },
      "&:before": {
        content: '"R"',
        left: 4,
        opacity: 0,
      },
      "&:after": {
        content: '"T"',
        right: 4,
      },
    },
    [`& .${switchClasses.checked}`]: {
      [`&.${switchClasses.switchBase}`]: {
        color: "#185a9d",
        transform: "translateX(32px)",
        "&:hover": {
          backgroundColor: "rgba(24,90,257,0.08)",
        },
      },
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: "#fff",
      },
      [`& + .${switchClasses.track}`]: {
        background: "linear-gradient(to right, #43cea2, #185a9d)",
        "&:before": {
          opacity: 1,
        },
        "&:after": {
          opacity: 0,
        },
      },
    },
  });