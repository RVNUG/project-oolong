import React from 'react'
import _ from 'lodash'

class Events extends React.Component {
  //eventsUrl = 'https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=Roanoke-Valley-NET-User-Group&callback=eventsLoaded&page=200&fields=&order=time&desc=false&status=upcoming&sig_id=199537590&sig=185fa3b3783205398c68577a1a6567b41e1c8c1d';
  eventsUrl = 'https://api.meetup.com/Roanoke-Valley-NET-User-Group/events?format=json&callback=eventsLoaded&order=time&desc=false&status=upcoming';
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      events: []
    }
  }
  
  componentDidMount() {
    this.addJsonpResponseHandler();
    this.invokeRequest();
  }

  render() {
    return (
      <section id="events" className="main special">
        <header className="major">
          <h2>Upcoming Events</h2>
        </header>

        {
          this.state.loading ?
            <div>
              <h3>loading...</h3>
            </div>
          :
            <ul className="events">
              {
                this.state.events.map(event =>
                  <li key={event.id}>
                    <h3>{event.time}</h3>
                    <h4>{event.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: event.desc }} />
                    <a href={event.url} target="meetup" className="button"><i className="fa fa-meetup"></i> RVSP on Meetup</a>
                  </li>)
              }
            </ul>
        }
        {/*<footer className="major">*/}
          {/*<ul className="actions">*/}
            {/*<li><Link to="/generic" className="button">Learn More</Link></li>*/}
          {/*</ul>*/}
        {/*</footer>*/}
      </section>
    )
  }

  addJsonpResponseHandler() {
    window["eventsLoaded"] = (response) => {
      let eventData = response.data.map((event) => {
        const date = new Date(event.time);

        return {
          id: event.id,
          title: event.name,
          desc: event.description,
          time: this.daysOfWeek[date.getDay()] + ' ' + date.toLocaleString(),
          rsvp: event["yes_rsvp_count"],
          url: event["link"]
        };
      });

      // remove duplicate future events.
      eventData = _.uniqBy(eventData, 'title');

      this.setState({
        events: eventData,
        loading: false
      })

      document.getElementById('eventLoaderScript').remove();
    }
  }
  invokeRequest = _.once(() => {
    // Load using script tag (jsonp) to avoid cors issues
    const s = document.createElement("script");
    s.id = "eventLoaderScript";
    s.src = this.eventsUrl;
    document.body.appendChild(s);
  });
}

export default Events
