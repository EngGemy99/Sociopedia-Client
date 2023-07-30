import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  pushNewComment,
  setFriends,
  setPost,
  setPosts,
} from "state";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  friendId,
  picturePath,
  userPicturePath,
  likes,
  comments,
  index,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const neutralMain = palette.neutral.main;
  const primary = palette.primary.main;
  const [open, setOpen] = useState(false);

  const [commentsPost, setCommentsPost] = useState(comments);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //change number of likes
  const patchLike = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/post/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    console.log(updatedPost);
    dispatch(setPost({ post: updatedPost }));
  };

  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const coment = {
      comment,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/post/${postId}/comment`,
      coment,
      config
    );
    dispatch(pushNewComment({ _id: postId, comments: data.comments }));
    // window.location.reload();
    setComment("");
  };
  const handleDeleteComment = async (event, commentId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${process.env.REACT_APP_API_URL}/post/${postId}/comment/${commentId}`,
      config
    );
    // event.target.closest(".commentCard").remove();
    // window.location.reload();
    console.log(data);
    dispatch(deleteComment({ _id: postId, comments: data.comments }));
    // window.reload();
  };

  useEffect(() => {}, [posts]);
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={friendId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />

      <Typography color={neutralMain} sx={{ mt: "1rem", textAlign: "right" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          {/**Likes section */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          {/**Comment section */}
          <FlexBetween>
            {/* test */}
            <IconButton
              onClick={() => {
                handleClickOpen();
                setIsComments(!isComments);
              }}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{commentsPost.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/**Actual comments */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <Box>
          <Box
            sx={{
              minHeight: "300px",
              overflowY: "scroll",
            }}
          >
            {commentsPost.map((item, index) => (
              <Box
                key={item._id}
                sx={{
                  padding: "25px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                className="commentCard"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar alt={item.user.firstName} src={item.user.picture} />
                    <Typography
                      sx={{ color: "text.secondary", m: "0.5rem", pl: "1rem" }}
                    >
                      {item.user.firstName} {item.user.lastName}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      m: "0.5rem",
                      pl: "1rem",
                      flex: "1",
                      textAlign: "right",
                    }}
                  >
                    {item.comment}
                  </Typography>
                  {user._id == item.user._id && (
                    <Box>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                          handleDeleteComment(e, item._id);
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            color: "#ff0000",
                            cursor: "pointer",
                          }}
                        />
                      </IconButton>
                    </Box>
                  )}
                </Stack>
              </Box>
            ))}
          </Box>
          <Stack spacing={2} direction={"row"}>
            <TextField
              label="Add a comment"
              value={comment}
              onChange={handleCommentChange}
              variant="outlined"
              sx={{ width: "100%" }}
            />
            <IconButton
              onClick={handleCommentSubmit}
              sx={{ cursor: "pointer" }}
            >
              <SendIcon color="primary" fontSize="large" />
            </IconButton>
          </Stack>
        </Box>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;
