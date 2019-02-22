import React, { Component } from 'react';
import './ConfirmModal.css';

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.checkUserConfirm = this.checkUserConfirm.bind(this);
  }

  checkUserConfirm(e) {
    const { confirmHandler } = this.props;
    const userDecision = Boolean(parseInt(e.target.value));

    confirmHandler(userDecision);
  }

  render() {
    return (
      <div className="confirmModalContainer">
        <div className="confirmModalCover">
          <div className="confirmText">
            <div>The website hasn't been archived yet!</div>
            <div className="ask">Would you like to archive it?</div>
          </div>
          <div className="confirmBtnCover">
            <button className="confirmBtn" type="button" onClick={this.checkUserConfirm} value="1">Yes</button>
            <button className="confirmBtn" type="button" onClick={this.checkUserConfirm} value="0">No</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmModal;
