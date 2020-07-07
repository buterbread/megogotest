import React, { PureComponent } from 'react';
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

const REFRESH_RATE = 250; // MS
const MAX_GRAPH_TIMERANGE = 600; // MS
const MAX_GRAPH_ITEMS = Math.trunc(1000 / REFRESH_RATE * MAX_GRAPH_TIMERANGE);

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
      upperLimit: -Infinity
    }
  }

  startGraph = () => {
    if (this.grapRefresher) {
      return null;
    }

    const graphBox = document.getElementById('Graph1').getElementsByClassName('graphBox-content')[0];

    this.grapRefresher = setInterval( () => {
      console.log(MAX_GRAPH_ITEMS);

      if (graphBox.childElementCount > MAX_GRAPH_ITEMS) {
        this.removeGraphItem(graphBox);
      }

      this.createGraphItem(graphBox);
    }, REFRESH_RATE);

    return null;
  }

  stopGraph() {
    clearTimeout(this.grapRefresher);
    this.grapRefresher = undefined;

    return null;
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

    if (!streamBandwidth || !estimatedBandwidth || !bufferSize) {
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

  render() {
    const { upperLimit } = this.state;
    const { isPlaying } = this.props;

    return (
      <>
        {isPlaying ? this.startGraph() : this.stopGraph()}
        <div className="graphBox" id="Graph1">
          <div className="graphBox-header">
            <div className="graphBox-headerBuffSize">Buffer size (sec)</div>
            <div className="graphBox-headerBuffering">
              Buffering<br />
              <span><i className="graphBox-headerBufferingIcon yes" />Yes</span>, <span><i className="graphBox-headerBufferingIcon no" />No</span>
            </div>
            <div className="graphBox-headerBw"><span><i className="graphBox-headerBwIcon stream" />Stream BandWidth</span>, <span><i className="graphBox-headerBwIcon estimated" />Estimated BandWidth</span></div>
            {upperLimit > 0 && (
              <div className="graphBox-headerUpperLimit">Max Scale BandWidth b/s: {upperLimit}</div>
            )}
          </div>
          <div className="graphBox-content" />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const { player } = state;
  const { streamBandwidth, estimatedBandwidth, bufferSize, isBuffering, isPlaying } = player;

  return {
    streamBandwidth,
    estimatedBandwidth,
    bufferSize,
    isBuffering,
    isPlaying,
  }
};

export default connect(mapStateToProps, null)(ChartBox);
