import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

const Navbar = () => {
    const [iconActive, setIconActive] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("auth") || "");
    const [user, setUser] = useState(
        localStorage.getItem("token")
    );
    const [role, setRole] = useState(localStorage.getItem("role"))
    const [userId, setUserId] = useState(localStorage.getItem("id"))

    const logoutFunc = () => {
        // dispatch(setUserInfo({}));
        localStorage.removeItem("auth");
        localStorage.removeItem("role")
        localStorage.removeItem("id")
        navigate("/");
        setToken('')
        setRole('')
    };
    const handleLogin = () => {
        navigate("/login");
    }
    const handleRegister = () => {
        navigate("/register")
    }
    return (
        <header>
            <nav className={iconActive ? "nav-active" : ""}>
                {role != null &&
                    <h2 className="absolute top-3 left-5">
                        {role == "Customer" ?
                            <NavLink to={`/customer/settings/${userId}`}>Profile</NavLink>
                            : role == "Employee" ?
                                <NavLink to={`/employee/dashboard/${userId}`}>Dashboard</NavLink>
                                : role == "Agent" ?
                                    <NavLink to={`/agent/dashboard/${userId}`}>Dashboard</NavLink>
                                    : <NavLink to={`/admin/dashboard/${userId}`}>Dashboard</NavLink>
                        }


                    </h2>
                }

                <ul className="nav-links">
                    <li>
                        <NavLink to={"/"}>Home</NavLink>
                    </li>

                    <li>
                        <NavLink to={"/policies"}>All Policies</NavLink>
                    </li>
                    {role === "Customer" &&
                        <>
                            <li>
                                <NavLink to={`/customer/feedback/${userId}`}>Feedbacks</NavLink>
                            </li>
                            <li>
                                <div className="dropdown">
                                    <NavLink to={`/customer/add-query/${userId}`}>Queries</NavLink>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink to={`/customer/query/${userId}`}>See FAQs</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={`/customer/add-query/${userId}`}>Ask Query</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <NavLink to={`/customer/policy-account/${userId}`}>My accounts</NavLink>
                            </li>
                            <li>
                                <NavLink to={`/customer/documents/upload`}>Documents Upload</NavLink>
                            </li>
                        </>
                    }



                    {!token ? (
                        <div className="absolute top-3 right-12 flex gap-2">
                            <button className="btn btn-primary" onClick={handleLogin}>
                                Login
                            </button>
                            <button className="btn btn-secondary" onClick={handleRegister}>
                                Register
                            </button>
                        </div>
                    ) : (
                        <div className="absolute top-3 right-12">
                            <button className="btn btn-danger" onClick={logoutFunc}>
                                Logout
                            </button>
                        </div>
                    )}
                </ul>
            </nav>
            <div className="menu-icons">
                {!iconActive && (
                    <FiMenu
                        className="menu-open"
                        onClick={() => {
                            setIconActive(true);
                        }}
                    />
                )}
                {iconActive && (
                    <RxCross1
                        className="menu-close"
                        onClick={() => {
                            setIconActive(false);
                        }}
                    />
                )}
            </div>
        </header>
    );
};

export default Navbar;