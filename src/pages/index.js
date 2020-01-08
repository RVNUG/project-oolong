import React from 'react'
import Helmet from 'react-helmet'
import Waypoint from 'react-waypoint'

import Layout from '../components/layout'
import Header from '../components/Header'
import Nav from '../components/Nav'
import Events from '../components/Events'

import starPic from '../assets/images/roanoke-star-128.png'
import apex from '../assets/images/sponsors/apex.png'
import teksystems from '../assets/images/sponsors/teksystems.png'
import gedigital from '../assets/images/sponsors/gedigital.png'
import discountASPNET from '../assets/images/sponsors/discountASPNET.png'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stickyNav: false,
    }
  }

  _handleWaypointEnter = () => {
    this.setState(() => ({ stickyNav: false }))
  }

  _handleWaypointLeave = () => {
    this.setState(() => ({ stickyNav: true }))
  }

  render() {
    return (
      <Layout>
        <Helmet title="Roanoke Valley .NET User Group" />

        <Header />

        <Waypoint
          onEnter={this._handleWaypointEnter}
          onLeave={this._handleWaypointLeave}
        ></Waypoint>
        <Nav sticky={this.state.stickyNav} />

        <div id="main">
          <section id="intro" className="main">
            <div className="spotlight">
              <div className="content">
                <header className="major">
                  <h2>What we're about</h2>
                </header>
                <p>
                  The Roanoke Valley .NET User Group was formed to support the
                  .NET users in the Roanoke Valley and beyond. We're a friendly
                  group that welcomes both questions...and answers!
                </p>
                <p>
                  We meet on the first Thursday of each month at the{' '}
                  <a
                    href="https://goo.gl/maps/dWgNx3mbxU9BzS1o6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GE Digital building
                  </a>
                  , in downtown Roanoke:
                </p>
                <p>
                  <address>
                    <strong>
                      GE Digital
                      <br />
                      207 Bullitt Ave SE
                      <br />
                      Roanoke, VA 24013
                    </strong>
                  </address>
                </p>
                <p>
                  Visit{' '}
                  <a
                    href="https://meetup.com/Roanoke-Valley-NET-User-Group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {' '}
                    our Meetup site
                  </a>{' '}
                  to take part in group discussions or to sign up for our
                  Meetup.
                </p>
                <p>
                  Visit{' '}
                  <a
                    href="https://github.com/rvnug"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    our GitHub organization
                  </a>
                  to see code snippets from our past meetings.
                </p>
                <p>
                  Would you like to{' '}
                  <a
                    href="https://secure.meetup.com/Roanoke-Valley-NET-User-Group/contribute/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    donate to our group
                  </a>
                  ?
                </p>
              </div>
              <span className="image">
                <img src={starPic} alt="" />
              </span>
            </div>
          </section>

          <Events />

          <section id="officers" className="main special">
            <header className="major">
              <h2>2020 RV.NUG Board</h2>
            </header>

            <div className="content">
              <ul className="officers-list">
                <li>Tolga Balci, President</li>
                <li>Bret Shawn</li>
                <li>Derek Pinkerton</li>
                <li>Will Ashley</li>
                <li>Alex Mikhail</li>
              </ul>
              <br />
              <p>
                To contact us please email:{' '}
                <a href="mailto:officers@rvnug.org">officers@rvnug.org</a>
              </p>
            </div>
          </section>

          <section id="sponsors" className="main special">
            <header className="major">
              <h2>2020 Sponsors</h2>
            </header>
            <a
              href="https://www.apexsystems.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={apex} alt="Apex Systems" />
            </a>

            <a
              href="https://www.teksystems.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={teksystems} alt="TekSystems" />
            </a>

            <a
              href="https://www.ge.com/digital/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={gedigital} alt="GE Digital" />
            </a>

            <a
              href="https://www.discountasp.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={discountASPNET} alt="Discount ASP.NET" />
            </a>
          </section>
        </div>
      </Layout>
    )
  }
}

export default Index
