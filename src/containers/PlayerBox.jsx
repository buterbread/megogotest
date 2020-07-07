import React, { useRef, useEffect } from 'react';
import ShakaPlayer from 'shaka-player-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playerActions from '../redux/player/actions'

import 'shaka-player/dist/demo.css';
import 'shaka-player/dist/controls.css';

function PlayerBox({ url, actions }) {
  const playerRef = useRef(null);

  let timeStreamer;

  async function playerLoadUrl() {
    const { current } = playerRef || {}
    const { player } = current || {};

    actions.togglePlaying(false);

    await player.load(url);

    afterLoad();
  }

  function afterLoad() {
    const { current } = playerRef || {}
    const { videoElement, player } = current || {};

    player.addEventListener('buffering', (e) => {
      const { buffering } = e;

      actions.toggleBuffering(buffering);

      if (buffering) {
        actions.togglePlaying(true);
      }

      if (!timeStreamer) {
        startTimeStreaming();
      }

      actions.setBufferSize(player.getConfiguration().streaming.bufferingGoal);
    })

    player.addEventListener('adaptation', () => {
      updatePlaybackStats();
    })

    videoElement.addEventListener('playing', () => {
      startTimeStreaming();
      actions.togglePlaying(true);
    });

    videoElement.addEventListener('pause', () => {
      stopTimeStreaming();
      actions.togglePlaying(false);
    });

    videoElement.addEventListener('ended', () => {
      stopTimeStreaming();
      actions.togglePlaying(false);
    });

    videoElement.play();
  }

  function startTimeStreaming() {
    const { current } = playerRef || {}
    const { videoElement } = current || {};

    if (timeStreamer) {
      return
    }

    actions.setCurrentTime(videoElement.currentTime);

    timeStreamer = setTimeout(refreshCurrentTime, 1000, videoElement);
  }

  function refreshCurrentTime(videoElement) {
    actions.setCurrentTime(videoElement.currentTime);

    timeStreamer = setTimeout(refreshCurrentTime, 1000, videoElement);
  }

  function stopTimeStreaming() {
    clearTimeout(timeStreamer);
    timeStreamer = undefined;
  }

  function updatePlaybackStats() {
    const { current } = playerRef || {}
    const { player } = current || {};

    const { estimatedBandwidth, streamBandwidth } = player.getStats();

    actions.setStreamBandwidth(streamBandwidth);
    actions.setEstimatedBandwidth(estimatedBandwidth);
  }

  useEffect(() => {
    playerLoadUrl();

    return () => {
      // remove event listeners & timers;
    }
  });

  return (
    <ShakaPlayer width="720" height="576" ref={playerRef} />
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(playerActions, dispatch),
  }
}

export default connect(null, mapDispatchToProps)(PlayerBox);
