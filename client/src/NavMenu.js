import React from 'react';
import { Icon } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import { Rules } from "./Rules";
import "./Navigation.css"

export const NavMenu = () => {

    return (
        // <div className="NavBar">
        //     <nav>
        //         <ul className="NavLinks">
        //             <li><NavLink to="/" className="AboutLink"> Home </NavLink></li>
        //             <li><NavLink to="/about" className="AboutLink"> About </NavLink></li>
        <div className="nav-menu">
            <div id="home-nav">
                <NavLink to="/" style = {{color: "white"}}> <Icon name='home'/> </NavLink>
            </div>
            <div id = "rule-nav">
                <Rules />
            </div>
         </div>
        //     </nav>
        // </div>
    );
}