import React, {useEffect, useState} from 'react';
import {Link, withRouter, useLocation} from "react-router-dom";
import "../assets/css/settings.css";

function SettingsHeader() {
    const [selectedBtn, selectMenu] = useState(1);
    let location = useLocation();

    useEffect(() => {
        if (location.pathname === '/settings-profile') {
            selectMenu(1);
        } else if (location.pathname === '/settings-security') {
            selectMenu(2);
        } else if (location.pathname === '/settings-practices') {
            selectMenu(3);
        } else if (location.pathname === '/settings-waiting') {
            selectMenu(4);
        } else if (location.pathname === '/settings-drag') {
            selectMenu(5);
        }
    }, [location.pathname]);

    const [menuVisible, setMenuVisible] = useState(false);
    const profileToggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <>
            <div className="flex-header justify-center">
                <Link to="/settings-profile">
                    <div
                        className={selectedBtn === 1 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                    >
                        Profile
                    </div>
                </Link>
                <Link to="/settings-security">
                    <div
                        className={selectedBtn === 2 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                    >
                        Security
                    </div>
                </Link>
                <Link to="/settings-practices">
                    <div
                        className={selectedBtn === 3 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                    >
                        Practices
                    </div>
                </Link>
                <Link to="/settings-waiting">
                    <div
                        className={selectedBtn === 4 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                    >
                        Waiting Room
                    </div>
                </Link>
                <Link to="/settings-drag">
                    <div
                        className={selectedBtn === 5 ? "btnSelected btn-navbar txt-16 txt-medium btnBar8-rl" : "btn-navbar txt-16 txt-medium btnBar8-rl"}
                    >
                        Drag and Drop
                    </div>
                </Link>
            </div>
            <div className="menu-right" onClick={profileToggleMenu}>
                <img className="practice-mobile-menu mouse-cursor"
                     src={require('../assets/img/practice-menu.svg')} alt=""/>
            </div>
            {
                menuVisible && (
                    <div className="menu-container trans-menu">
                        <Link to="/settings-profile">
                            <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Profile</div>
                        </Link>
                        <Link to="/settings-security">
                            <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Security</div>
                        </Link>
                        <Link to="/settings-practices">
                            <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Practices</div>
                        </Link>
                        <Link to="/settings-waiting">
                            <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Waiting Room</div>
                        </Link>
                        <Link to="/settings-drag">
                            <div className="navbar-menu txt-16 txt-medium justify-center btnBar8-rl">Drag and Drop</div>
                        </Link>
                    </div>
                )
            }
        </>
    );
}

export default withRouter(SettingsHeader);
