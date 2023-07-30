import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget1 from "./PostWidget";

/**
 * Wrapper Component for posts
 * getPosts is gonna grab all posts from anyone on the home page (getFeedPosts middleware)
 * getUserPosts can also grab all posts from a specific user when navigating into their page (getUserPosts)
 * This is determined through if statement in useEffect (when component gets rendered for the first time)
 */
const PostsWidget = ({ userId, isProfile = false }) => {
  const PostWidget = memo(PostWidget1);

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [test,setTest]=useState(useSelector((state) => state.posts))
  const getPosts = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { posts } = await response.json();
    dispatch(setPosts({ posts }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/post/user_posts/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data.posts }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile]);

  useEffect(() => {
    setTest(posts)
    console.log(test)
  }, [posts])


  return (
    <>
      {test.length > 0 &&
        test.map((post, index) => (
          <PostWidget
            key={post._id}
            postId={post._id}
            postUserId={post.user?._id}
            name={`${post.user?.firstName} ${post.user?.lastName}`}
            description={post.description}
            picturePath={post.picturePost}
            userPicturePath={post.user?.picture}
            likes={post.likes}
            friendId={post.user?._id}
            comments={post.comments}
            index={index}
          />
        ))}
    </>
  );
};

export default PostsWidget;
