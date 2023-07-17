import axios from "axios";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
    const state = useLocation().state;
    const [value, setValue] = useState(state?.desc || "");
    const [title, setTitle] = useState(state?.title || "");
    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        var imgUrl = state?.img || file;
        if (file) {
          imgUrl = await upload();
        }
        try {
            const res = state
                ? await axios.put(`/posts/${state._id}`, {
                      title,
                      desc: value,
                      img: imgUrl,
                  })
                : await axios.post(`/posts/`, {
                      title,
                      desc: value,
                      img: imgUrl,
                      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                  });
            alert(res.data);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="editorContainer">
                    <ReactQuill
                        className="editor"
                        theme="snow"
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <h1>Publish</h1>
                    <span>
                        <b>Status: </b> Draft
                    </span>
                    <span>
                        <b>Visibility: </b> Public
                    </span>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        id="file"
                        onChange={(e) => {
                          setFile(e.target.files[0]);

                        }}
                    />
                    <label className="file" htmlFor="file">
                        Upload Image
                    </label>
                    <div className="buttons">
                        <button>Save as a draft</button>
                        <button onClick={handleClick}>Publish</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Write;
