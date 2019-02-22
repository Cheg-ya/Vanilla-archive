import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      directoryPath: ''
    };
  }

  onChange(e) {
    const inputUrl = e.target.value;

    this.setState({
      url: inputUrl
    });
  }

  onSubmit(e) {
    e.preventDefault();

    fetch('/api/web', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: this.state.url })
    }).then(res => res.json()).then(result => {
        this.setState({
          directoryPath: result
        });
      }).catch(err => {
        if (err) {
          console.log(err);
          alert(err.message);
        }
      });
  }

  render() {
    const { url, directoryPath } = this.state;

    return (
      <div>
        <a href="http://localhost:3000/search/123">Way Back!</a>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" spellCheck="false" onChange={this.onChange.bind(this)} value={url}></input>
        </form>
        {directoryPath.length > 0 && <iframe className="frame" src={directoryPath}></iframe>}
      </div>
    );
  }
}

export default Search;
