import React, { useState } from 'react';
import {useNhostClient, useUserData, usen, useFileUpload} from "@nhost/react"
import userEvent from "@testing-library/user-event";
import {gql, useMutation, useQuery} from "@apollo/client";
import {Grid, Avatar, TextField, Button, Typography, Rating, useMediaQuery} from '@mui/material';
const UPDATE_PP =
    gql`mutation updateAvatar($id: uuid!, $avatarUrl: String!) {
    updateUser(pk_columns: {id: $id}, _set: {avatarUrl: $avatarUrl}) {
        avatarUrl
    }
}`
const GET_USER = gql`
query getUser($id: uuid!) {
    user(id: $id) {
        rating
        reviews_count
        displayName
    }
}`;

const ProfilePicture = () => {
    let userdata = useUserData();
    let isMedium = useMediaQuery("(max-width:900px)");
    const [pictureUrl, setpictureUrl] = useState(userdata.avatarUrl);
    const nHost = useNhostClient();
    const [ addPP, { datam, loadingm, errorm }] = useMutation(UPDATE_PP, {
        variables: {
            "id": userdata.id,
        }
    });
    const { loading, data, error } = useQuery(GET_USER, {
        variables: {
            "id": useUserData().id,
        }
    });
    const {
        add,
        upload,
        cancel,
        isUploaded,
        isUploading,
        isError,
        progress,
        id,
        bucketId,
        name
    } = useFileUpload()

    const handleFileChange = async (event) => {
        console.log(event)
        const file = event.target.files[0];
        try {
            const response = await upload({file});
            await addPP({
                variables:{
                    avatarUrl : nHost.storage.getPublicUrl({ fileId: response.id })
                }
            })
            setpictureUrl(nHost.storage.getPublicUrl({ fileId: response.id }))
        } catch (error) {
            console.error('Error uploading file:', error);
        }

    };

    return (
        <Grid container marginTop={"1vh"} direction="column" alignItems="center" spacing={2}>
            <Grid>
                <div>
                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                        fontWeight={'semibold'}
                        mb={1}
                        variant='h6'>
                        {userdata.displayName}
                    </Typography>
                    <Rating readOnly value={data?.user?.rating || 0} size="small" />
                </div>
            </Grid>
            <Grid item>
                <Avatar
                    src={pictureUrl}
                    style={{ width: "20vw", height: "20vw" }}
                />
            </Grid>
            <Grid item>
                <label htmlFor="upload-photo">
                    <input
                        style={{ display: 'none' }}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button color="primary" variant="contained" component="span">
                        Modifier son avatar
                    </Button>
                </label>
            </Grid>
        </Grid>
    );
};

export default ProfilePicture;