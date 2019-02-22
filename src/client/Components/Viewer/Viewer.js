import React, { Component } from 'react';
import './Viewer.css';

class Viewer extends Component {
  render() {
    console.log(this.props.match);
    const { url, latest } = this.props.match.params;
    const directoryPath = `/public/assets/${url}/index.html`;

    return (
      <div>
        <iframe className="frame" src={directoryPath}></iframe>
      </div>
    );
  }
}

export default Viewer;
