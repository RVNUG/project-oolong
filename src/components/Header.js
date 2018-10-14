import React from 'react'

import star from '../assets/images/roanoke-star-128.png';

const Header = (props) => (
    <header id="header" className="alt">
        <span className="logo"><img src={star} alt="Roanoke Star" /></span>
        <h1>Roanoke Valley .Net User Group</h1>

    </header>
)

export default Header
