import Typography from "@mui/material/Typography";
import {MenuItem, Menu, Box, IconButton} from "@mui/material";
import {useState} from "react";
import {SignedIn, useUserDisplayName, useSignOut, useAuthenticated} from "@nhost/react";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from "@mui/material/Tooltip";
import {useNavigate, useLocation} from "react-router-dom";
import React from "react";

export const Avatar = ({color}) => {
    const navigate = useNavigate();
    const { signOut } = useSignOut()
    const isAuthenticated = useAuthenticated()
    const [anchorElUser, setAnchorElUser] = useState(null);
    const userDisplayName = useUserDisplayName()
    const location = useLocation()
    const handleOpenUserMenu = (event) => {
        if(isAuthenticated) {
            setAnchorElUser(event.currentTarget);
        } else {
            navigate("/sign-in", {state:{from: location}})
        }
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row-reverse' }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <SignedIn>
                        <Typography sx={{color: color, mr: 2}}>{userDisplayName}</Typography>
                    </SignedIn>
                        <PersonIcon  sx={{ color: color }}/>
                </IconButton>
            </Tooltip>
            <IconButton sx={{mr:3}}>
                <NotificationsIcon sx={{ color: color }}/>
            </IconButton>
            <IconButton sx={{mr:1}}>
                <MessageIcon sx={{ color: color }}/>
            </IconButton>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={()=>navigate("/account/reservations")}>
                    <Typography textAlign="center">Mes trajets</Typography>
                </MenuItem>
                <MenuItem onClick={()=> {
                    signOut().then(() => {
                        handleCloseUserMenu()
                        navigate("/")
                    })
                    }
                }>
                    <Typography textAlign="center">Deconnexion</Typography>
                </MenuItem>
            </Menu>
        </Box>
    )
}