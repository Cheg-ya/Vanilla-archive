import React, { Component } from 'react';
import './UpdateModal.css';

class UpdateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: ''
    };

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmitHandler(e) {
    const { updateHandler } = this.props;
    const { url } = this.state;
    
    e.preventDefault();

    updateHandler(url);

    this.setState(() => ({ url: '' }));
  }

  handleInputChange(e) {
    const inputUrl = e.target.value;

    this.setState(() => {
      return {
        url: inputUrl
      };
    });
  }

  render() {
    const { url } = this.state;
    const { closeModal } = this.props;

    return (
      <div className="updateModalContainer">
        <form className="updateModalForm" onSubmit={this.onSubmitHandler}>
          <div className="closeBtn" onClick={closeModal}><i className="fas fa-window-close"></i></div>
          <div className="updateModalText">Please enter URL that you'd like to archive!</div>
          <div className="updateInputField">
            <input className="urlInput" type="text" spellCheck="false" onChange={this.handleInputChange} value={url}></input>
          </div>
          <button className="submitBtn" type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default UpdateModal;
