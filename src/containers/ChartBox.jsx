import React, { PureComponent } from 'react';
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

const REFRESH_RATE = 250; // MS
const MAX_GRAPH_TIME_RANGE = 600; // MS
const MAX_GRAPH_ITEMS = Math.trunc(1000 / REFRESH_RATE * MAX_GRAPH_TIME_RANGE);

class ChartBox extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    streamBandwidth: PropTypes.number,
    estimatedBandwidth: PropTypes.number,
    bufferSize: PropTypes.number,
    isBuffering: PropTypes.bool,
  };

  static defaultProps = {
    data: null,
    streamBandwidth: null,
    estimatedBandwidth: null,
    bufferSize: null,
    isBuffering: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      upperLimit: -Infinity,
      graphTicks: 1000 / REFRESH_RATE,
    }
  }

  startGraph = () => {
    if (this.graphRefresher) {
      return null;
    }

    const graphBox = document.getElementById('Graph1').getElementsByClassName('graphBox-content')[0];
    const timelineBox = document.getElementById('Graph1').getElementsByClassName('graphBox-timeline')[0];

    this.graphRefresher = setTimeout( this.refreshGraph, REFRESH_RATE, graphBox, timelineBox);

    return null;
  }

  refreshGraph = (graphBox, timelineBox) => {
    if (graphBox.childElementCount > MAX_GRAPH_ITEMS) {
      this.removeGraphItem(graphBox);
      this.removeTimeLineItem(timelineBox);
    }

    const { graphTicks } = this.state;

    this.createGraphItem(graphBox);

    if (graphTicks >= (1000 / REFRESH_RATE)) {
      this.setState({ graphTicks: 1 })
      this.createTimelineItem(timelineBox)
    } else {
      this.setState({ graphTicks: (graphTicks + 1) })
    }

    this.graphRefresher = setTimeout( this.refreshGraph, REFRESH_RATE, graphBox, timelineBox);
  }

  stopGraph() {
    clearTimeout(this.graphRefresher);
    this.graphRefresher = undefined;

    clearTimeout(this.timelineRefresher);
    this.timelineRefresher = undefined;

    return null;
  }

  createTimelineItem = (timelineBox) => {
    const newEl = document.createElement('DIV');
    newEl.classList.add('graphTimelineItemBox');
    newEl.innerHTML = renderToString(this.renderTimelineItem());

    timelineBox.appendChild(newEl);
  }

  removeTimeLineItem = (timelineBox) => {
    timelineBox.removeChild(timelineBox.childNodes[0])
  }

  createGraphItem = (graphBox) => {
    const newEl = document.createElement('DIV');
    newEl.classList.add('graphItemBox');
    newEl.innerHTML = renderToString(this.renderGraphItem());

    graphBox.appendChild(newEl);
  }

  removeGraphItem = (graphBox) => {
    graphBox.removeChild(graphBox.childNodes[0])
  }

  getUpperLimit = (value) => {
    const { upperLimit } = this.state;

    const valueOrder = value.toString().length - 1;
    const floorCoefficient = 1.05;

    const result = (parseInt((value * floorCoefficient).toString()[0], 10) + 1) * Math.pow(10, valueOrder);

    if ( result > upperLimit ) {
      this.setState({ upperLimit: result })
      return result;
    }

    return upperLimit
  }

  renderGraphItem = () => {
    const { streamBandwidth, estimatedBandwidth, bufferSize, isBuffering } = this.props;

    if (!streamBandwidth || !estimatedBandwidth) {
      return null;
    }

    const estimatedBandwidthKbPs = Math.trunc(estimatedBandwidth);
    const streamBandwidthKbPs = Math.trunc(streamBandwidth);

    const biggestValueUpperLimit = this.getUpperLimit(Math.max(estimatedBandwidthKbPs, streamBandwidthKbPs));

    const estimatedStyle = {
      width: `${estimatedBandwidthKbPs / biggestValueUpperLimit * 100}%`,
      zIndex: estimatedBandwidthKbPs < streamBandwidthKbPs ? 3 : 2
    }

    const streamStyle = {
      width: `${streamBandwidthKbPs / biggestValueUpperLimit * 100}%`
    }

    return (
      <div className="graphItem">
        <div className="graphItem-buffer">
          <div className="graphItem-bufferText">{bufferSize}</div>
        </div>
        <i className={`graphItem-isBuffering ${isBuffering ? 'isActive' : ''}`} />
        <div className="graphItem-bw">
          <div className="graphItem-bwEstimated" style={estimatedStyle}>{Math.trunc(estimatedBandwidth)}</div>
          <div className="graphItem-bwStream" style={streamStyle}>{streamBandwidth}</div>
        </div>
        <div className="graphItem-infoBox">
          <div className="graphItem-info">
            <div className="graphItem-infoItem">Buffer Size sec: {bufferSize}</div>
            <div className="graphItem-infoItem">Estimated Bandwidth: {Math.trunc(estimatedBandwidth)}</div>
            <div className="graphItem-infoItem">Stream Bandwidth: {streamBandwidth}</div>
            <div className="graphItem-infoItem">Buffering: {isBuffering ? ('Yes') : ('No')}</div>
          </div>
        </div>
      </div>
    )
  }

  renderTimelineItem = () => {
    const { currentTime } = this.props;

    if (currentTime === null) {
      return null;
    }

    const GRAPH_ITEM_HEIGHT = 6;

    const style = {
      '--height': `${1000 / REFRESH_RATE * GRAPH_ITEM_HEIGHT}px`
    }

    return (
      <div className="graphBox-timelineItem" style={style}>
        <div className="graphBox-timelineItemText">{this.formatCurrentTime(currentTime)}</div>
      </div>
    )
  }

  formatCurrentTime = (time) => {
    const total = Math.round(time);
    const minutes = Math.trunc(total / 60);
    const seconds = Math.trunc(total - minutes * 60);

    return `${minutes}: ${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  render() {
    const { upperLimit } = this.state;
    const { isPlaying } = this.props;

    return (
      <>
        {isPlaying ? this.startGraph() : this.stopGraph()}
        <div className="graphBox" id="Graph1">
          <div className="graphBox-header">
            <div className="graphBox-timelinePos">Timeline position</div>
            <div className="graphBox-headerBuffSize">Buffer size (sec)</div>
            <div className="graphBox-headerBuffering">
              Buffering<br />
              <span><i className="graphBox-headerBufferingIcon yes" />Yes</span>, <span><i className="graphBox-headerBufferingIcon no" />No</span>
            </div>
            <div className="graphBox-headerBw"><span><i className="graphBox-headerBwIcon stream" />Stream Bandwidth</span>, <span><i className="graphBox-headerBwIcon estimated" />Estimated Bandwidth</span></div>
            {upperLimit > 0 && (
              <div className="graphBox-headerUpperLimit">Max Scale Bandwidth b/s: {upperLimit}</div>
            )}
          </div>
          <div className="graphBox-timeline" />
          <div className="graphBox-content" />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const { player } = state;
  const { streamBandwidth, estimatedBandwidth, bufferSize, isBuffering, isPlaying, currentTime } = player;

  return {
    streamBandwidth,
    estimatedBandwidth,
    bufferSize,
    isBuffering,
    isPlaying,
    currentTime,
  }
};

export default connect(mapStateToProps, null)(ChartBox);
