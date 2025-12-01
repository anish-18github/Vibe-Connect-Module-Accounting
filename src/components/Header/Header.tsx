// import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RefreshCw, Settings, Search, Bell, PlusSquare, CheckCircle, ChevronsRight } from "react-feather";
import "./header.css";


function Header() {

    const location = useLocation();
    const pathParts = location.pathname.split("/").filter(Boolean);


    return (

        <div>
            <header className="header">
                <img src="/profile.jpg" alt="" className="profile" />
                <h2>Vibe Connect</h2>

                <nav>
                    <Link to="/Search"><Search /></Link>
                    <Link to="/New-Tab"><PlusSquare /></Link>
                    <Link to="/Recent"><RefreshCw /></Link>
                    <Link to="/Approval"><CheckCircle /></Link>
                    <Link to="/Notification"><Bell /></Link>
                    <Link to="/Setting"><Settings /></Link>
                </nav>
            </header>

            {/* <div className="side-bar"></div> */}

            <div className="breadcrumb mt-3 fw-normal">
                <ChevronsRight size={20} />

                {/* Dashboard always present */}
                <Link to="/" className="breadcrumb-link">
                    Dashboard
                </Link>

                {/* Loop through each part and build full path */}
                {pathParts.map((part, index) => {
                    const to = "/" + pathParts.slice(0, index + 1).join("/");

                    return (
                        <div key={index} className="breadcrumb-item-flex">
                            <ChevronsRight size={20} />

                            <Link to={to} className="breadcrumb-link">
                                {part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Link>
                        </div>
                    );
                })}
            </div>



        </div>


    );
}

export default Header;

