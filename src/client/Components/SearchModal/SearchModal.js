import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SearchModal.css';

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ''
    };

    this.storeUrl = this.storeUrl.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  storeUrl(e) {
    const inputUrl = e.target.value;

    this.setState({
      url: inputUrl
    });
  }

  handleOnSubmit(e) {    
    const { webpageHandler } = this.props;
    const { url } = this.state;

    e.preventDefault();

    webpageHandler(url);
  }

  render() {
    const { url } = this.state;

    return (
      <div className="searchModalContainer">
        <div className="searchModalCover">
          <form className="searchModalForm" onSubmit={this.handleOnSubmit}>
            <Link className="closeBtn" to="/"><i className="fas fa-window-close"></i></Link>
            <div className="searchModalText"><span>What would you like to search?</span></div>
            <input className="searchInputField" type="text" spellCheck="false" onChange={this.storeUrl} value={url}></input>
            <button className="submitBtn" type="submit">Submit</button>
          </form>
        </div>
        <div className="cover">
          <img className="introImg" src="https://media.giphy.com/media/T1zgJ7cp8tWla/giphy.gif" />
        </div>
      </div>
    );
  }
}

export default SearchModal;
