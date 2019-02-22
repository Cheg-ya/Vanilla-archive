import React, { Component } from 'react';
import './NoMatch.css';

class NoMatch extends Component {
  render() {
    return (
      <div className="noMatchCover">
        <img className="noMatchImg" src="https://media.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif" />
      </div>
    );
  }
}

export default NoMatch;
