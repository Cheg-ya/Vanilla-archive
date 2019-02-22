import React, { Component, Fragment } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import './app.css';
import Intro from './Components/Intro/Intro';
import Viewer from './Components/Viewer/Viewer';
import NoMatch from './Components/NoMatch/NoMatch';
import DateViewer from './Components/DateViewer/DateViewer';
import SearchModal from './Components/SearchModal/SearchModal';
import UpdateModal from './Components/UpdateModal/UpdateModal';
import ConfirmModal from './Components/ConfirmModal/ConfirmModal';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayConfirmModal: false,
      displayUpdateModal: false,
      fetchOnProgress: false,
      userConfirm: false,
      targetUrl:'',
      pickedCalendarDate: ''
    };

    this.toggleUpdateModal = this.toggleUpdateModal.bind(this);
    this.handleUserConfirm = this.handleUserConfirm.bind(this);
    this.getWebpageHandler = this.getWebpageHandler.bind(this);
    this.updateWebpageHandler = this.updateWebpageHandler.bind(this);
    this.updateWebpage = this.updateWebpage.bind(this);
    this.getWebpage = this.getWebpage.bind(this);
    this.routingHandler = this.routingHandler.bind(this);
    this.getPickedWebpage = this.getPickedWebpage.bind(this);
    this.handlePickedDate = this.handlePickedDate.bind(this);
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
    }, this.getWebpage);
  }

  toggleUpdateModal() {
    this.setState((prevState) => {
      return {
        displayUpdateModal: !prevState.displayUpdateModal
      };
    });
  }

  getWebpageHandler(url) {
    if (url.length === 0) {
      return alert('invalid URL');
    }

    const { fetchOnProgress } = this.state;

    if (fetchOnProgress) {
      return alert('App is in Progress');
    }

    this.setState((() => {
      return {
        fetchOnProgress: true,
        targetUrl: url
      };
    }), this.getWebpage);
  }

  getWebpage() {
    const { targetUrl, userConfirm } = this.state;

    fetch('/api/web/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: targetUrl, userConfirm: userConfirm })
    }).then(res => res.json()).then(result => {
      if (result.status) {
        this.setState(() => {
          return {
            fetchOnProgress: false,
            userConfirm: false,
            targetUrl: ''
          };
        });

        return alert(result.message); 
      }

      this.routingHandler(result);

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

  routingHandler(result) {
    const { isSaved, url, isSingleData } = result;
    const { history } = this.props;

    if (!isSaved && isSingleData === null) {
      return this.setState(() => {
        return {
          displayConfirmModal: true
        };
      });
    }
    
    if (!isSaved && !isSingleData) {
      this.setState(() => {
        return {
          fetchOnProgress: false,
          userConfirm: false,
          targetUrl: ''
        };
      });

      return history.push(`/search/${url}/calendar`);
    }

    if (isSingleData) {
      this.setState(() => {
        return {
          fetchOnProgress: false,
          userConfirm: false,
          targetUrl: ''
        };
      });

      return history.push(`/search/${url}/latest`);
    }
  }

  updateWebpageHandler(url) {
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
    const { targetUrl } = this.state;

    fetch('/api/web/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: targetUrl })
    }).then(res => res.json()).then(result => {
      if (result.status) {
        this.setState(() => {
          return {
            fetchOnProgress: false,
            userConfirm: false,
            targetUrl: ''
          };
        });

        return alert(result.message); 
      }

      const { url } = result;
      const { history } = this.props;

      this.setState(() => {
        return {
          fetchOnProgress: false,
          userConfirm: false,
          targetUrl: ''
        };
      });

      history.push(`/search/${url}/latest`);

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

  handlePickedDate(value) {
    const { id, date, url } = value;

    this.setState(() => {
      return {
        fetchOnProgress: true,
        pickedCalendarDate: date,
        targetUrl: url
      };

    }, () => {
      this.getPickedWebpage(id);
    });
  }

  getPickedWebpage(id) {
    const { targetUrl } = this.state;

    fetch(`/api/web/search/${targetUrl}/${id}`)
    .then(res => res.json())
    .then(result => {
      const { done } = result;

      if (done) {
        const { pickedCalendarDate, targetUrl } = this.state;
        const { history, location } = this.props;

        const urlInfo = {
          date: pickedCalendarDate,
          url: targetUrl
        };

        this.setState(() => {
          return {
            fetchOnProgress: false,
            targetUrl: '',
            pickedCalendarDate: ''
          };
        });

        return history.push(`${location.pathname}/${urlInfo.date}`);
      }

    }).catch(err => alert(err));
  }

  render() {
    const { displayUpdateModal, displayConfirmModal, fetchOnProgress } = this.state;

    return (
      <Fragment>
        {fetchOnProgress
        &&<div className="loaderCover">
            <div className="loader">
              <HashLoader size={200} color={'#9083fe'} />
            </div>
          </div>}
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
          {displayUpdateModal && <UpdateModal webpageHandler={this.updateWebpageHandler} closeModal={this.toggleUpdateModal}/>}
          <Switch>
            <Route exact path="/" component={Intro}></Route>
            <Route exact path="/search" render={props => <SearchModal {...props} webpageHandler={this.getWebpageHandler}/>} />
            <Route exact path="/search/:url/calendar" render={props => <DateViewer {...props} dateHandler={this.handlePickedDate} />} />
            <Route exact path="/search/:url/calendar/:date" render={props => <Viewer {...props} />} />
            <Route exact path="/search/:url/latest" render={props => <Viewer {...props} />} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </Fragment>
    );
  }
}
