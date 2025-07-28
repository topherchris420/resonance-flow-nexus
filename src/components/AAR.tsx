import React from 'react';
import { SessionLogEntry } from '../types/focus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AARProps {
  sessionLog: SessionLogEntry[];
  onClose: () => void;
}

const AAR: React.FC<AARProps> = ({ sessionLog, onClose }) => {
  if (sessionLog.length === 0) {
    return null;
  }

  const lastEntry = sessionLog[sessionLog.length - 1];

  const data = sessionLog.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString(),
    coherence: entry.vibrationalCoherence,
    stability: entry.spectralPhaseStability,
  }));

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-white max-w-2xl w-full">
        <h2 className="text-2xl mb-4">After-Action Review</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-lg">Cognitive Performance:</p>
            <p className="text-4xl font-bold">{lastEntry.cognitivePerformance?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-lg">Stress Regulation:</p>
            <p className="text-4xl font-bold">{lastEntry.stressRegulation?.toFixed(2)}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="coherence" stroke="#8884d8" />
            <Line type="monotone" dataKey="stability" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
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
