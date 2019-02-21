import React, { Component, Fragment } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './app.css';
import Search from './Components/Search/Search';
import Intro from './Components/Intro/Intro';
import UpdateModal from './Components/UpdateModal/UpdateModal';

export default class App extends Component {
  constructor(prop) {
    super(prop);

    this.state = {
      displayModal: false
    };

    this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
    this.updateWebpage = this.updateWebpage.bind(this);
  }

  toggleUpdateModal() {
    this.setState((prevState) => {
      return {
        displayModal: !prevState.displayModal
      };
    });
  }

  updateWebpage() {
    //ajax
  }

  render() {
    const { displayModal } = this.state;

    return (
      <Fragment>
        <header className="heeaderContainer">
          <div className="headerTitle">Vanilla Archive</div>
          <ul className="navigation">
            <li className="naviList">
              <Link to="/" className="introLink">
                <i className="fas fa-home"></i>
                <span> Home</span>
              </Link>
            </li>
            <li className="naviList">
              <Link to="/main" className="introLink">
                <i className="fas fa-search"></i>
                <span> Search</span>
              </Link>
            </li>
            <li className="naviList">
              <i className="fas fa-edit"></i>
              <button className="updateModal" onClick={this.toggleUpdateModal}> Update</button>
            </li>
          </ul>
        </header>
        <main className="introMain">
         {displayModal && <UpdateModal updateHandler={this.updateWebpage} />}
          <Switch>
            <Route exact path="/" component={Intro} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}
