import React, { useState, useEffect } from 'react';

const RadioPlayer = ({ url }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = document.getElementById('radioPlayer');
    playing ? player.play() : player.pause();
  }, [playing]);

  return (
    <div>
      <audio id="radioPlayer" src={url} />
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Pausar' : 'Reproducir'}
      </button>
    </div>
  );
};

export default RadioPlayer;
