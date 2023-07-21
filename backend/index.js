import express from "express";
import cors from "cors";
import MongoDB from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import {ObjectId} from 'mongodb';
import multer from "multer";
import fs from "fs";

// init app & middleware
const app = express();
const PORT = 8800;
app.use(cors({ credentials: true, origin: ["https://nishitas-blog.netlify.app", "http://localhost:3000"] }));
app.use(express.json());
app.use(cookieParser());

// db connection
let db;
const databaseName = "nishita-blog";
MongoDB.connectToDB((err) => {
    if (err) {
        console.log(err);
        return err;
    }
    app.listen(PORT, () => {
        console.log(`Server Running on PORT:${PORT}`);
    });
    db = MongoDB.getDb(databaseName);
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '../frontend/public/upload');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now()+file.originalname);
//     }
// })
  
// const upload = multer({ storage });

// app.post('/upload', upload.single('file'), function (req, res, next) {
//     const file = req.file;
//     res.status(200).json(file.filename);
// })

function validate (obj, required) {
    const errors = [];
    required.forEach((key) => {
        if (!(key in obj) || obj[key] === '') {
            errors.push(key);
        }
    });
    return errors;
}

// auth
app.post("/auth/register", (req, res) => {
    const required = ["email", "userName", "password"];
    const errors = validate(req.body, required);
    if (errors.length) {
        res.status(400).json(`${errors} field missing`);
    } else {
        const { email, userName, password } = req.body;
        const query = { $or: [{ email }, { userName }] };
        db.collection("users")
            .findOne(query)
            .then((result) => {
                if (result) {
                    res.status(409).json("User already exists!");
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password, salt);
                    var newUser = { email, userName, password: hash, role: "user" };
                    db.collection("users")
                    .insertOne(newUser)
                    .then(() => {
                        res.status(200).json("New user added.");
                    })
                    .catch(() => {
                        res.status(500).json(err);
                    });
                }
            })
            .catch((err) => {
                res.json(err);
            });
    }
});

app.post("/auth/login", (req, res) => {
    const required = ["userName", "password"];
    const errors = validate(req.body, required);
    if (errors.length) {
        res.status(400).json(`${errors} field missing`);
    } else {
        const { userName, password } = req.body;
        const query = { userName };
        db.collection("users")
            .findOne(query)
            .then((result) => {
                if (result === null) {
                    res.status(404).json("User not found!");
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(password, result.password);
                    if (!isPasswordCorrect) {
                        res.status(400).json("Wrong userName or password!");
                    } else {
                        const token = jwt.sign({ id: result._id }, "jwtkey");
                        const {password, ...other} = result;
                        res.cookie("accessToken", token, {
                            httpOnly: true,
                            sameSite: 'none',
                            secure: true
                        }).status(200).json(other);
                    }
                }
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    }
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been successfully logged out.")
});

// posts
// getPosts
app.get("/posts/", (req, res) => {
    let posts = [];

    db.collection("posts")
        .find()
        .sort({ date: -1 })
        .forEach((post) => posts.push(post))
        .then(() => {
            res.status(200).json(posts);
        })
        .catch(() => {
            res.status(500).json({ error: "Could not fetch all the posts." });
        });
});

// getPost
app.get("/posts/:id", (req, res) => {
    const id = new ObjectId(req.params.id);
    const query = {_id: id};
    db.collection("posts")
            .findOne(query)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
});

// addPost
app.post("/posts/", (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json("Unauthorized!");
    } else {
        jwt.verify(token, "jwtkey", (err, userInfo) => {
            if (err) {
                res.status(403).json("Invalid token!");
            } else {
                const {title, desc, img, date} = req.body;
                const userId = userInfo.id;
                const query = {title, desc, img, date, userId};
                db.collection("posts")
                    .insertOne(query)
                    .then(() => {
                        res.status(200).json("Post has been created.");
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
            }
        });
    }
});

// deletePost
app.delete("/posts/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json("Unauthorized!");
    } else {
        jwt.verify(token, "jwtkey", (err, userInfo) => {
            if (err) {
                res.status(403).json("Invalid token!");
            } else {
                const postId = new ObjectId(req.params.id);
                const query = {_id: postId, userId: userInfo.id};
                db.collection("posts")
                .deleteOne(query)
                .then(() => {
                    res.status(200).json("Post has been deleted!");
                })
                .catch((err) => {
                    res.status(500).json(err);
                });
            }
        });
    }
});

// updatePost
app.put("/posts/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json("Unauthorized!");
    } else {
        jwt.verify(token, "jwtkey", (err, userInfo) => {
            if (err) {
                res.status(403).json("Invalid token!");
            } else {
                const {title, desc, img} = req.body;
                const postId = new ObjectId(req.params.id);
                const query = {_id: postId};
                const newValues = { $set: {title, desc, img} };
                db.collection("posts")
                    .updateOne(query, newValues)
                    .then(() => {
                        res.status(200).json("Post has been updated.");
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
            }
        });
    }
});

// users
app.get("/users/", (req, res) => {
    let users = [];

    db.collection("users")
        .find()
        .sort({ userName: 1 })
        .forEach((user) => users.push(user))
        .then(() => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500).json({ error: "Could not fetch all the users." });
        });
});
