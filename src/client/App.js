import React, { Component, Fragment } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './app.css';
import Search from './Components/Search/Search';
import Intro from './Components/Intro/Intro';
import UpdateModal from './Components/UpdateModal/UpdateModal';
import ConfirmModal from './Components/ConfirmModal/ConfirmModal';

export default class App extends Component {
  constructor(prop) {
    super(prop);

    this.state = {
      displayConfirmModal: false,
      displayUpdateModal: false,
      fetchOnProgress: false,
      targetUrl:'',
      userConfirm: false
    };

    this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
    this.handleUserConfirm = this.handleUserConfirm.bind(this);
    this.updateWebpage = this.updateWebpage.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
  }

  toggleUpdateModal() {
    this.setState((prevState) => {
      return {
        displayUpdateModal: !prevState.displayUpdateModal
      };
    });
  }

  handleUserConfirm(userDecision) {
    if (!userDecision) {
      return this.setState(prevState => {
        return {
          fetchOnProgress: !prevState.fetchOnProgress,
          displayConfirmModal: !prevState.displayConfirmModal,
          targetUrl: ''
        };
      });
    }

    this.setState(prevState => {
      return {
        displayConfirmModal: !prevState.displayConfirmModal,
        userConfirm: !prevState.userConfirm
      };
    }, this.updateWebpage);
  }

  updateHandler(url) {
    if (url.length === 0) {
      return alert('invalid URL');
    }

    const { fetchOnProgress } = this.state;

    if (fetchOnProgress) {
      return alert('App is in Progress');
    }

    this.setState((prevState => {
      return {
        displayUpdateModal: !prevState.displayUpdateModal,
        fetchOnProgress: true,
        targetUrl: url
      };
    }), this.updateWebpage);
  }

  updateWebpage() {
    const { targetUrl, userConfirm } = this.state;

    fetch('/api/web/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: targetUrl, userConfirm: userConfirm })
    }).then(res => res.json()).then(result => {
      if (result.status === 404) {
        this.setState(() => {
          return {
            fetchOnProgress: false,
            userConfirm: false,
            targetUrl: ''
          };
        });

        return alert(result.message); 
      }
      
      const { dataSaved } = result;

      if (!dataSaved) {
        return this.setState(() => {
          return {
            displayConfirmModal: true
          };
        });
      }

      if (dataSaved) {
        return this.setState(() => {
          return {
            fetchOnProgress: false,
            userConfirm: false,
            targetUrl: ''
          };
        });
      }

    }).catch(err => {
      this.setState(() => {
        return {
          fetchOnProgress: false,
          userConfirm: false,
          targetUrl: ''
        };
      });

      return alert('Error: ' + err.message);
    });
  }

  render() {
    const { displayUpdateModal, displayConfirmModal } = this.state;
    console.log('App\'s state: ', this.state);
    return (
      <Fragment>
        <header className="headerContainer">
          <div className="headerTitle">Vanilla Archive</div>
          <ul className="navigation">
            <li className="naviList">
              <Link to="/" className="introLink">
                <i className="fas fa-home"></i>
                <span> Home</span>
              </Link>
            </li>
            <li className="naviList">
              <Link to="/search" className="introLink">
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
          {displayConfirmModal && <ConfirmModal confirmHandler={this.handleUserConfirm}/>}
          {displayUpdateModal && <UpdateModal updateHandler={this.updateHandler} closeModal={this.toggleUpdateModal}/>}
          <Switch>
            <Route exact path="/" component={Intro} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}
