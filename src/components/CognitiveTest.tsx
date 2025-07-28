import React, { useState, useEffect } from 'react';
import { FocusState } from '../types/focus';

interface CognitiveTestProps {
  isActive: boolean;
  focusState: FocusState;
  onTestComplete: (score: number) => void;
}

const CognitiveTest: React.FC<CognitiveTestProps> = ({ isActive, focusState, onTestComplete }) => {
  const [testData, setTestData] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState<any>(null);

  useEffect(() => {
    if (!isActive) {
      setTestData(null);
      return;
    }

    if (focusState === 'CRL-M') {
      // Generate a memory test
      const sequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      setTestData({ type: 'memory', sequence });
    } else if (focusState === 'CRL-P') {
      // Generate a pattern recognition test
      const sequence = [1, 2, 4, 8, 16];
      const missingNumber = 32;
      setTestData({ type: 'pattern', sequence, missingNumber });
    }
  }, [isActive, focusState]);

  const handleAnswer = () => {
    if (testData.type === 'memory') {
      const score = testData.sequence.toString() === userAnswer ? 1 : 0;
      onTestComplete(score);
    } else if (testData.type === 'pattern') {
      const score = parseInt(userAnswer, 10) === testData.missingNumber ? 1 : 0;
      onTestComplete(score);
    }
  };

  if (!testData) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 p-8 rounded-lg text-white">
      <h2 className="text-2xl mb-4">Cognitive Test</h2>
      {testData.type === 'memory' && (
        <div>
          <p className="mb-4">Memorize the following sequence:</p>
          <p className="text-4xl font-bold mb-4">{testData.sequence.join(' ')}</p>
          <input
            type="text"
            className="bg-transparent border-b-2 border-white text-center text-2xl w-full"
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>
      )}
      {testData.type === 'pattern' && (
        <div>
          <p className="mb-4">What is the next number in the sequence?</p>
          <p className="text-4xl font-bold mb-4">{testData.sequence.join(' ')} __</p>
          <input
            type="text"
            className="bg-transparent border-b-2 border-white text-center text-2xl w-full"
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>
      )}
      <button
        className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAnswer}
      >
        Submit
      </button>
    </div>
  );
};

export default CognitiveTest;
