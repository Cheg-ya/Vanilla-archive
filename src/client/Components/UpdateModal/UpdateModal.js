import React, { Component } from 'react';
import './UpdateModal.css';

class UpdateModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      url: '',
      
    };

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmitHandler() {
    const { updateWebpage } = this.props;
    const { url } = this.state.url;

    this.setState((prevState) => {
      return {

      };
    }, updateWebpage.call(url));
  }

  handleInputChange(e) {
    this.setState(() => {
      return {
        url: e.target.value
      };
    });
  }

  render() {
    const { url } = this.state;

    return (
      <form className="updateModalContainer" onSubmit={this.onSubmitHandler}>
        <label>url</label>
        <input className="urlInput" type="text" onChange={this.handleInputChange} value={url}></input>
      </form>
    );
  }
}

export default UpdateModal;
