import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Intro.css';

class Intro extends Component {
  render() {
    return (
      <div className="introContainer">
        <div className="introModal">
          <div className="modalText">
            <span>Would you like to travel in time?</span>
          </div>
          <Link className="startBtn" to="/search">
            <span>Click to Start</span>
          </Link>
        </div>
        <div className="cover">
          <img className="introImg" src="https://media.giphy.com/media/MuTJGqZCfWBEs/giphy.gif" />
        </div>
      </div>
    );
  }
}

export default Intro;
