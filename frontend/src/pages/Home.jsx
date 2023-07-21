import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [])
  
  // const posts = [
  //   {
  //     id: 1,
  //     title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  //     desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eius modi dolorum officiis, praesentium ducimus quasi neque placeat ullam atque magni nulla iste, eligendi reiciendis deleniti cum. Architecto, temporibus sapiente.",
  //     img: "https://media.istockphoto.com/id/1151869858/vector/a-young-doctor-waving-his-hand-and-holding-a-tablet.jpg?s=612x612&w=0&k=20&c=NIuy934Kuh3PQnGKuXwflU8Tiu9vs2N97kgb-uJpHZE="
  //   },
  //   {
  //     id: 2,
  //     title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  //     desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eius modi dolorum officiis, praesentium ducimus quasi neque placeat ullam atque magni nulla iste, eligendi reiciendis deleniti cum. Architecto, temporibus sapiente.",
  //     img: "https://media.istockphoto.com/id/1151869858/vector/a-young-doctor-waving-his-hand-and-holding-a-tablet.jpg?s=612x612&w=0&k=20&c=NIuy934Kuh3PQnGKuXwflU8Tiu9vs2N97kgb-uJpHZE="
  //   },
  //   {
  //     id: 3,
  //     title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  //     desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eius modi dolorum officiis, praesentium ducimus quasi neque placeat ullam atque magni nulla iste, eligendi reiciendis deleniti cum. Architecto, temporibus sapiente.",
  //     img: "https://media.istockphoto.com/id/1151869858/vector/a-young-doctor-waving-his-hand-and-holding-a-tablet.jpg?s=612x612&w=0&k=20&c=NIuy934Kuh3PQnGKuXwflU8Tiu9vs2N97kgb-uJpHZE="
  //   },
  //   {
  //     id: 4,
  //     title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  //     desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eius modi dolorum officiis, praesentium ducimus quasi neque placeat ullam atque magni nulla iste, eligendi reiciendis deleniti cum. Architecto, temporibus sapiente.",
  //     img: "https://media.istockphoto.com/id/1151869858/vector/a-young-doctor-waving-his-hand-and-holding-a-tablet.jpg?s=612x612&w=0&k=20&c=NIuy934Kuh3PQnGKuXwflU8Tiu9vs2N97kgb-uJpHZE="
  //   },
  // ]

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  }

  return (
    <div className='home'>
      <div className="posts">
        {posts.map(post=>(
          <div className="post" key={post._id}>
            <div className="img">
              <img src={`${post.img}`} alt="" />
            </div>
            <div className="content">
              <Link className='link' to={`/post/${post._id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              <Link className='link' to={`/post/${post._id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home