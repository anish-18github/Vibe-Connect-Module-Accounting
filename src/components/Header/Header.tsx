// import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Settings, Search, Bell, PlusSquare, CheckCircle, FastForward } from "react-feather";
import "./header.css";


function Header() {
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

            <div className="side-bar"></div>

            <div className="breadcrumb">
                
            <FastForward />
            <span>Dashboard</span>
            <FastForward />
            <span>Dashboard</span>
            </div>
        </div>


    );
}

export default Header;

