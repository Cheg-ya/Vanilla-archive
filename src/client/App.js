import React, { Component, Fragment } from 'react';
import './app.css';
import ReactImage from './react.png';
import Parser from 'html-react-parser';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      location: ''
    };
  }

  onChange(e) {
    this.setState({
      url: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    fetch('/api/web', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: this.state.url })
    }).then(res => res.json()).then(result => {
        this.setState({
          location: result
        });
      }).catch(err => {
        if (err) {
          console.log(err);
          alert(err.message);
        }
      });
  }

  render() {
    const { location, url } = this.state;

    return (
      <div>
        <h1>Way Back!</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" onChange={this.onChange.bind(this)} value={url}></input>
        </form>
        {location.length > 0 &&<iframe className="frame" src={location}></iframe>}
      </div>
    );
  }
}
