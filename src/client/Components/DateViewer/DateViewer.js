import React, { Component } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import { HashLoader } from 'react-spinners';
import 'react-calendar-heatmap/dist/styles.css';
import './DateViewer.css';

class DateViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamps: [],
      fetchOnProgress: false
    };

    this.getDates = this.getDates.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    const { url } = this.props.match.params;

    this.setState(() => {
      return {
        fetchOnProgress: true
      };
    }, () => {
      this.getDates(url);
    });
  }

  getDates(url) {
    fetch(`/api/web/search/${url}`)
    .then(res => res.json())
    .then(result => {
      const { timestamps } = result;

      this.setState(() => {
        return {
          timestamps: timestamps,
          fetchOnProgress: false
        };
      });

    }).catch(err => {
      return alert('Error: ', err);
    });
  }

  handleOnClick(value) {
    this.props.dateHandler(value);
  }

  render() {
    const { timestamps, fetchOnProgress } = this.state;

    return (
      <div className="calendarCover">
        {fetchOnProgress
        &&<div className="loaderCover">
            <div className="loader">
              <HashLoader size={200} color={'#9083fe'} />
            </div>
          </div>}
        <h2>Select Time when you'd like to travel!</h2>
        <CalendarHeatmap
          startDate={new Date('2019-01-01')}
          endDate={new Date('2019-12-31')}
          values={timestamps}
          tooltipDataAttrs={value => {
            if (!value.date) {
              return {
                'data-tip': ''
              };
            }

            return {
              'data-tip': new Date(value.date).toISOString().slice(0, 10)
            };
          }}
          showWeekdayLabels={true}
          onClick={this.handleOnClick}
        />
        <ReactTooltip />
      </div>
    );
  }
}

export default DateViewer;
