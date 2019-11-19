import React, { Component } from 'react';
import './App.css';


class App extends Component {
  state = {events: []}

  componentDidMount() {
    fetch('/events')
      .then(res => res.json())
      .then(events => this.setState({ events }));
  }

  
  render() {
    return (
      <div className="App">
        <h1>Events</h1>
        {this.state.events.map(event =>
          <div key={event.id}>{event.title} {event.date} </div>
        )}

      </div>
    );
  }
}

export default App;