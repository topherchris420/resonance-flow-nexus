import React, { useState, useRef } from 'react';

const meditationTracks = [
  {
    title: 'Mantra for Inner Peace',
    src: '/audio/meditation1.mp3',
  },
  {
    title: 'Affirmations for Clarity',
    src: '/audio/meditation2.mp3',
  },
  {
    title: '20-Minute Guided SRV Session',
    src: '/audio/meditation3.mp3',
  },
];

const GuidedMeditation = () => {
  const [selectedTrack, setSelectedTrack] = useState(meditationTracks[0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTrackSelect = (track: typeof meditationTracks[0]) => {
    setSelectedTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.play();
    }
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Guided Meditations</h2>
      <div className="mb-4">
        <audio ref={audioRef} controls src={selectedTrack.src} className="w-full">
          Your browser does not support the audio element.
        </audio>
      </div>
      <div>
        <h3 className="font-bold mb-2">Playlist</h3>
        <ul>
          {meditationTracks.map((track) => (
            <li
              key={track.src}
              onClick={() => handleTrackSelect(track)}
              className={`p-2 cursor-pointer rounded ${
                selectedTrack.src === track.src ? 'bg-accent' : 'hover:bg-accent'
              }`}
            >
              {track.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GuidedMeditation;
