import React from 'react';
import { SessionLogEntry } from '../types/focus';

interface AARProps {
  sessionLog: SessionLogEntry[];
  onClose: () => void;
}

const AAR: React.FC<AARProps> = ({ sessionLog, onClose }) => {
  if (sessionLog.length === 0) {
    return null;
  }

  const lastEntry = sessionLog[sessionLog.length - 1];

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-white max-w-lg w-full">
        <h2 className="text-2xl mb-4">After-Action Review</h2>
        <p>Cognitive Performance: {lastEntry.cognitivePerformance?.toFixed(2)}</p>
        <p>Stress Regulation: {lastEntry.stressRegulation?.toFixed(2)}</p>
        {/* Add more AAR details here */}
        <button
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AAR;
