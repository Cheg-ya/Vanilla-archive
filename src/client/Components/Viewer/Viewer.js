import React, { Component } from 'react';
import { HashLoader } from 'react-spinners';
import './Viewer.css';

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchOnProgress: false,
      directoryPath: ''
    };

    this.getLatestPage = this.getLatestPage.bind(this);
  }

  componentDidMount() {
    const { url } = this.props.match.params;

    this.setState(() => {
      return {
        fetchOnProgress: true
      };

    }, () => {
      this.getLatestPage(url);
    });
  }

  getLatestPage(url) {
    if (!url.length || url.split('.').length < 3) {
      return alert('Invalid URL!');
    }

    fetch(`/api/web/search/${url}/latest`)
    .then(res => res.json()
    .then(result => {
      const { done, path, status, message } = result;
      const { history } = this.props;

      if (status) {
        this.setState(() => {
          return {
            fetchOnProgress: false
          };
        });

        alert(message);

        return history.push('/');
      }

      if (done) {
        this.setState(() => {
          return {
            fetchOnProgress: false,
            directoryPath: path
          };
        });
      }

    }).catch(err => alert(err)));
  }

  render() {
    const { directoryPath, fetchOnProgress } = this.state;

    return (
      <div>
        {fetchOnProgress
        &&<div className="loaderCover">
            <div className="loader">
              <HashLoader size={200} color={'#9083fe'} />
            </div>
          </div>}
        <iframe className="frame" src={directoryPath}></iframe>
      </div>
    );
  }
}

export default Viewer;
