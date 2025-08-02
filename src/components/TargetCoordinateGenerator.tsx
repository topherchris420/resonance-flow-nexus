import React, { useState } from 'react';

const TargetCoordinateGenerator = () => {
  const [coordinates, setCoordinates] = useState<string | null>(null);

  const generateCoordinates = () => {
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lon = (Math.random() * 360 - 180).toFixed(6);
    setCoordinates(`${lat}, ${lon}`);
  };

  const logSession = () => {
    if (coordinates) {
      console.log(`Session logged for coordinates: ${coordinates}`);
      // Here you would typically save the session data to a backend or local storage
      alert(`Session logged for coordinates: ${coordinates}`);
    } else {
      alert('Please generate coordinates first.');
    }
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Target Coordinate Generator</h2>
      <div className="mb-4 p-4 bg-background rounded">
        <p className="text-lg text-center font-mono">
          {coordinates || 'Click "Generate" to get new coordinates'}
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={generateCoordinates}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
        >
          Generate
        </button>
        <button
          onClick={logSession}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-2 px-4 rounded"
        >
          Log Session
        </button>
      </div>
    </div>
  );
};

export default TargetCoordinateGenerator;
