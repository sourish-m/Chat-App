import React from "react";
import {Link} from "react-router-dom";

import Logo from "../../img/logo.png";
import './LogoSearch.css'
import { UilSearch } from '@iconscout/react-unicons'

const LogoSearch = () => {
  return (
    <div className="LogoSearch">
        <Link to={'/newfeed'}>
            <img className={'cursor_pointer'} src={Logo} alt={"logo"} width={'50px'} />
        </Link>
        <div className="Search">
            <input type="text" placeholder="Find a friend"/>
            <div className="s-icon">
                <UilSearch/>
            </div>
        </div>
    </div>
  );
};

export default LogoSearch;
