import React, { useContext, useEffect, useState } from 'react'
import Edit from '../images/edit.png'
import Delete from '../images/delete.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/authContext'

const Single = () => {
  axios.defaults.withCredentials = true;
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const {currentUser} = useContext(AuthContext);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId, BACKEND_URL]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/posts/${postId}`);
      navigate("/");
      alert(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  }

  return (
    <div className='single'>
      <div className="content">
        <img src={`${post.img}`} alt="" />
        {currentUser?.role === "admin" && currentUser?._id === post.userId && <div className="edit_delete">
          <Link to={`/post/edit/${post._id}`} state={post}>
            <img src={Edit} alt="Edit" />
          </Link>
          <img src={Delete} alt="Delete" onClick={handleDelete} />
        </div>}
        <h1>{post.title}</h1>
        <p>{getText(post.desc)}</p>
      </div>
    </div>
  )
}

export default Single