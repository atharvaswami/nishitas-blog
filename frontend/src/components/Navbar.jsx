import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/NS_logo_green_bg.png";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    return (
        <div className="navbar">
            <div className="container">
                <div className="logo">
                  <Link to="/">
                    <img src={Logo} alt="logo" />
                  </Link>
                </div>
                <div className="links">
                    <Link className="link" to="/">
                        <h6>BLOG</h6>
                    </Link>
                    <Link className="link" to="notes">
                        <h6>NOTES</h6>
                    </Link>
                    <span>{currentUser?.userName}</span>
                    {currentUser ? (
                        <span onClick={logout}>Logout</span>
                    ) : (
                        <Link className="link" to="/login">
                            Login
                        </Link>
                    )}
                    {currentUser?.role === "admin" && <span className="write">
                        <Link className="link" to="/write">
                            Write
                        </Link>
                    </span>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
