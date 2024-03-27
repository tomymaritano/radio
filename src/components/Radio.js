import React, { useState } from 'react';
import ReactPlayer from 'react-player';

function RadioPlayer() {
  const [playing, setPlaying] = useState(false);
  const streamUrl = 'http://stream.srg-ssr.ch/m/rsj/mp3_128'; // Sustituye esto con la URL de tu flujo de radio


  return (
    <div>
      <ReactPlayer url={streamUrl} playing={playing} controls width="100%" height="50px" />
    </div>
  );
}

export default RadioPlayer;
