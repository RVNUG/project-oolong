import React from 'react'
// import { Link } from 'gatsby'
import Helmet from 'react-helmet'
import Waypoint from 'react-waypoint'

import Layout from '../components/layout'
import Header from '../components/Header'
import Nav from '../components/Nav'
import starPic from '../assets/images/roanoke-star-128.png'

import Events from '../components/Events'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickyNav: false
    }
  }

  _handleWaypointEnter= () => {
    this.setState(() => ({ stickyNav: false }));
  }

  _handleWaypointLeave = () => {
    this.setState(() => ({ stickyNav: true }));
  }

  render() {

    return (
      <Layout>
        <Helmet title="Roanoke Valley .Net User Group" />

        <Header />

        <Waypoint
          onEnter={this._handleWaypointEnter}
          onLeave={this._handleWaypointLeave}
        >
        </Waypoint>
        <Nav sticky={this.state.stickyNav} />

        <div id="main">

          <section id="intro" className="main">
            <div className="spotlight">
              <div className="content">
                <header className="major">
                  <h2>What we're about</h2>
                </header>
                <p>
                  The Roanoke Valley .Net User Group was formed to support the .NET users
                  in the Roanoke Valley and beyond. We're a friendly group that welcomes
                  both questions...and answers!
                </p>
                <p>
                  We meet on the first Thursday of each month at the Grandin CoLab, next to
                  Roanoke Natural Foods Co-op
                  <a href="https://goo.gl/maps/jwsnC">on Grandin Ave.</a>
                </p>
                <p>
                  <a href="https://secure.meetup.com/Roanoke-Valley-NET-User-Group/contribute/" className="btn btn-large">Click
                    here</a> to contribute to our group!
                </p>
              </div>
              <span className="image"><img src={starPic} alt="" /></span>
            </div>
          </section>

          <Events />

          <section id="officers" className="main special">
            <header className="major">
              <h2>2018 RV.NUG Board</h2>
            </header>

            <div className="content">
              <ul>
                <li>Bret Shawn, President</li>
                <li>Derek Pinkerton</li>
                <li>Tolga Balci</li>
                <li>Will Ashley</li>
                <li>Alex Mikhail</li>
              </ul>
              <br />
              <p>To contact us please email: <a href="mailto:officers@rvnug.org">officers@rvnug.org</a></p>
            </div>
          </section>

        </div>

      </Layout>
    )
  }
}

export default Index
