import React from 'react'

const Footer = props => (
  <footer id="footer">
    <section id="cta">
      <h2>Contact</h2>
      <dl className="alt">
        <dt>Address</dt>
        <dd>6215 Chadsworth Ct &bull; Roanoke, Virginia 24018 &bull; USA</dd>
        <dt>Email</dt>
        <dd>
          <a href="mailto:officers@rvnug.org">officers@rvnug.org</a>
        </dd>
      </dl>
      <ul className="icons">
        <li>
          <a
            target="social"
            href="http://www.twitter.com/rvnug"
            className="icon fa-twitter alt"
          >
            <span className="label">Twitter</span>
          </a>
        </li>
        {/* <li><a target="social" href="#" className="icon fa-facebook alt"><span className="label">Facebook</span></a></li> */}
        <li>
          <a
            target="social"
            href="https://github.com/RVNUG"
            className="icon fa-github alt"
          >
            <span className="label">GitHub</span>
          </a>
        </li>
        <li>
          <a
            target="social"
            href="https://www.meetup.com/Roanoke-Valley-NET-User-Group/"
            className="icon fa-meetup alt"
          >
            <span className="label">Meetup</span>
          </a>
        </li>
      </ul>
    </section>
    <p className="copyright">
      &copy; rvnug.org.{' '}
      <a href="mailto:officers@rvnug.org">officers@rvnug.org</a>.
    </p>
  </footer>
)

export default Footer
