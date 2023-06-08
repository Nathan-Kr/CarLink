import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    styled,
    Typography,
    Rating,
    Box,
    Stack,
    useMediaQuery,
} from '@mui/material';
import {Avatar} from '../components/Avatar'
import {useNhostClient, useUserData, usen} from "@nhost/react"
import {gql, useQuery} from "@apollo/client";
import mobileLogo from "../images/mobileLogo.png";
import logo from "../images/Logo.png";
import bg from "../images/homeBg.jpg";
import {Link, useNavigate} from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";
const GET_USER = gql`
query getUser($id: uuid!) {
    user(id: $id) {
        rating
        reviews_count
        displayName
    }
}`;

const CustomCard = styled(Card)({
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
});

const Profile = () => {
    const displayName = useUserData().displayName;
    let isMedium = useMediaQuery("(max-width:900px)");
    let isMobile = useMediaQuery("(max-width:750px)");
    const navigate = useNavigate();
    const styles = {
        banner: {
            background: `url(${bg}) center center/cover no-repeat`,
            height: "100vh",
            width: "100%",
            opacity: 1,
            zIndex: -1,
            position: "absolute",
            top: 0,
            left: 0,
            "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "linear-gradient(rgb(0,0,0,0.8), rgb(0,0,0,0.3))",

                opacity: 0.7,
                zIndex: -10,
            },
        },

        tabs: {
            color: "white",
            display: "flex",
            justifyContent: "center",
            gap: "5rem",
            width: "100vw",
            ...(isMedium && {
                position: "absolute",
                top: "10rem",
                left: "1rem",
            }),
            ...(isMobile && {
                display: "none",
            }),
        },
        searchFields: {
            backgroundColor: "white",
            height: "65px",
            borderRadius: "100rem",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingLeft: "30px",
            width: "55rem",

            ...(isMedium && {
                position: "absolute",
                top: "15rem",

                width: "80vw",
            }),
            ...(isMobile && {
                position: "absolute",
                top: "10rem",
                p: 1,
                width: "70vw",
                flexDirection: "column",
                height: "45vh",
                borderRadius: "1rem",
            }),
        },
        inputs: {
            fontSize: "12px",
            fontWeight: "bold",
            mt: "10px",
            width: "10rem",
            ...(isMobile && {
                width: "80%",
            }),
        },

        vl: {
            position: "relative",
            top: "15",
            height: "20%",
            backgroundColor: "rgb(228, 228, 228)",
            width: "1.5px",
            marginRight: "20px",
            paddingBottom: "15px",
        },
        hl: {
            position: "relative",
            top: "20px",

            backgroundColor: "rgb(228, 228, 228)",
            width: "100%",
            mt: "-2rem",
            mb: "1rem",
            paddingBottom: "1px",
        },
    };
    const { loading, data, error } = useQuery(GET_USER, {
        variables: {
            "id": useUserData().id,
        }
    });
    const publicUrl = useNhostClient().storage.getPublicUrl({ fileId: 'e00885db-3620-4306-9919-50f0bc7c41c3' })
    return (
        <Grid item md={3} xs={6}>
            <Link to="/">
                <img
                    style={{width: "10vw", position:"absolute", left: "2rem", top: "1rem"}}
                    src={isMedium ? mobileLogo : logo}
                    alt="logo"
                />
            </Link>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "2rem",
                    ...(isMedium && {
                        p: "1rem",
                    }),
                }}
            >
                <Box style={{width: "10vw", position:"absolute", right: "2rem", top: "2rem"}}>
                    <Avatar color="#000"/>
                </Box>
            </Box>
            <CustomCard elevation={0}>
                <ProfilePicture>
                </ProfilePicture>
            </CustomCard>
        </Grid>
    );
};

const StyledContent = styled(CardContent)({
    padding: 20,
});

export default Profile;