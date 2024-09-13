import React, { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import PostCard from "../../components/Posts/PostCard";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import GitHubIcon from "@mui/icons-material/GitHub";
import AddPost from "../../components/Posts/AddPost";
import axios from "axios";
import { config } from "../../App";
import { enqueueSnackbar } from "notistack";
import userImage from "../../../src/assets/user.png";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  //[ const [postData, setPostData] = useState([]);]
  // const post = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     userId: 2,
  //     profilePic:
  //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
  //   },
  // ];

  // const getData = async () => {
  //   let response = await axios.get(`${config.backendEndpint}/posts`);
  //   console.log(response);
  //   if (response.status === 200) {
  //     setPostData(response.data);
  //   }
  // };

  // useEffect(() => {
  //   getData();
  // }, [postData]);

  const [postData, setPostData] = useState([]);
  const userid = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("Username");
  const navigate = useNavigate();

  const getPost = async () => {
    try {
      const response = await axios.get(
        `${config.backEndpoint}/posts/${userid}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        setPostData(
          response.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
        enqueueSnackbar("Session expired. Please log in again.", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Failed to fetch posts", { variant: "error" });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${config.backEndpoint}/posts/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        setPostData(postData.filter((post) => post._id !== id));
        enqueueSnackbar("Post deleted successfully", { variant: "success" });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
        enqueueSnackbar("Session expired. Please log in again.", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Failed to delete post", { variant: "error" });
      }
    }
  };

  const handleUpdate = async (id, postText) => {
    try {
      const payload = { post: postText };
      const response = await axios.patch(
        `${config.backEndpoint}/posts/${id}`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        const updatedPost = response.data;
        const updatedPosts = postData.map((post) =>
          post._id === id ? updatedPost : post
        );
        setPostData(updatedPosts);
        enqueueSnackbar("Post updated successfully", { variant: "success" });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
        enqueueSnackbar("Session expired. Please log in again.", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Failed to update the post", { variant: "error" });
      }
    }
  };

  const addNewPost = (newPost) => {
    setPostData([newPost, ...postData]);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getPost();
    }
  }, [token]);

  return (
    <div className="bg-slate-200 dark:bg-zinc-800 h-full w-full  flex flex-col ">
      <div>
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="h-full w-full max-h-[350px] rounded-md "
        />
        <img
          src={userImage}
          className=" max-sm:hidden sm:w-[200px] sm:h-[200px]   rounded-full  absolute     sm:right-[245px] lg:right-[350px] xl:right-[460px]    2xl:left-0 2xl:right-[125px] m-auto sm:top-[300px]   z-[999]"
          alt=""
        />

        <div className="profile-Info  px-8  max-sm:p-0">
          <div className="p-8 pt-14 px-8 max-sm:px-6 m-4 bg-white dark:bg-black dark-text-white rounded-lg flex flex-col justify-center items-center">
            <div>
              <span className="text-3xl font-semibold">{user}</span>
            </div>
            <div className="flex justify-around py-2 w-full">
              <div className="flex">
                <div className="px-2 text-blue-600">
                  <LinkedInIcon />
                </div>
                <div className="px-2 text-blue-600">
                  <FacebookTwoToneIcon />
                </div>
                <div className="px-2">
                  <GitHubIcon />
                </div>
              </div>

              <div className=" text-red-600 max-sm:hidden">
                <LocationOnIcon />
                <span className="text-black dark:text-white"> New York</span>
              </div>
              <div>
                <LanguageIcon />
                <span className="px-1">jane.dev</span>
              </div>

              <div className="flex">
                <div className="px-2">
                  <MailOutlineIcon />
                </div>
                <div>
                  <MoreVertIcon />
                </div>
              </div>
            </div>
            <div>
              <button className=" px-3 py-1 rounded-md text-white hover:bg-blue-800 bg-blue-500">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddPost onPostAdded={addNewPost} />
      {postData.map((post) => (
        <PostCard
          postData={post}
          key={post._id}
          onDeletePost={handleDelete}
          onUpdatePost={handleUpdate}
        />
      ))}
    </div>
  );
};

export default Profile;
