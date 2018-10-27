import React from 'react'
// import { Link } from 'gatsby'
//
// import logo from '../assets/images/logo.svg';

const Footer = (props) => (
    <footer id="footer">
        {/*<section>*/}
            {/*<h2>Aliquam sed mauris</h2>*/}
            {/*<p>Sed lorem ipsum dolor sit amet et nullam consequat feugiat consequat magna adipiscing tempus etiam dolore veroeros. eget dapibus mauris. Cras aliquet, nisl ut viverra sollicitudin, ligula erat egestas velit, vitae tincidunt odio.</p>*/}
            {/*<ul className="actions">*/}
                {/*<li><Link to="/generic" className="button">Learn More</Link></li>*/}
            {/*</ul>*/}
        {/*</section>*/}
        <section id="cta">
            <h2>Contact</h2>
            <dl className="alt">
                <dt>Address</dt>
                <dd>1327 Grandin Rd SW &bull; Grandin Co-Lab &bull; Roanoke, VA 24073 &bull; USA</dd>
                <dt>Email</dt>
                <dd><a href="mailto:officers@rvnug.org">officers@rvnug.org</a></dd>
            </dl>
            <ul className="icons">
                <li><a target="social" href="http://www.twitter.com/rvnug" className="icon fa-twitter alt"><span className="label">Twitter</span></a></li>
                {/* <li><a target="social" href="#" className="icon fa-facebook alt"><span className="label">Facebook</span></a></li> */}
                <li><a target="social" href="https://github.com/RVNUG" className="icon fa-github alt"><span className="label">GitHub</span></a></li>
                <li><a target="social" href="https://www.meetup.com/Roanoke-Valley-NET-User-Group/" className="icon fa-meetup alt"><span className="label">Meetup</span></a></li>
            </ul>
        </section>
        <p className="copyright">&copy; rvnug.org. <a href="mailto:officers@rvnug.org">officers@rvnug.org</a>.</p>
    </footer>
)

export default Footer
