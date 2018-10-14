import React from 'react'
import Scrollspy from 'react-scrollspy'
import Scroll from './Scroll'

const Nav = (props) => (
    <nav id="nav" className={props.sticky ? 'alt' : ''}>
        <Scrollspy items={ ['intro', 'events', 'officers', 'cta'] } currentClassName="is-active" offset={-300}>
            <li>
                <Scroll type="id" element="intro">
                    <a href="#intro">Introduction</a>
                </Scroll>
            </li>
            <li>
                <Scroll type="id" element="events">
                    <a href="#events">Events</a>
                </Scroll>
            </li>
            <li>
                <Scroll type="id" element="officers">
                    <a href="#officers">Officers</a>
                </Scroll>
            </li>
            <li>
                <Scroll type="id" element="cta">
                    <a href="#cta">Contact</a>
                </Scroll>
            </li>
        </Scrollspy>
    </nav>
)

export default Nav
