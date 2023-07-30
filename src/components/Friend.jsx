import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useEffect, useState } from "react";


/** Contains top part of the post */
const Friend = ({ friendId, name, subtitle, userPicturePath,userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

const [toggleAdd,setToggleAdd]=useState(false)
  let isFriend =friends.find((friend) => friend._id === friendId);
  const isSelf = _id === friendId

  const patchFriend = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
      
      );
      const data = await response.json()
      dispatch(setFriends({ friends: data?.user?.friends}));
    };


  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        {/**User profile photo */}
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            console.log(friendId)
            navigate(`/profile/${friendId}`);
            // navigate(0); //refresh the page from when going into user prof and then going into another prof
          }}
        >
          {/**Name */}
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.main,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          {/**location */}
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
        {/**Friend button */}
      </FlexBetween>
      {!isSelf && (
        <IconButton
          onClick={() => {patchFriend() ;setToggleAdd(!toggleAdd)} }
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend && !toggleAdd ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;