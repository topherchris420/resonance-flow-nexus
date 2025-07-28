import React, { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  coherence: number;
}

interface TeamCoherenceProps {
  isActive: boolean;
}

const TeamCoherence: React.FC<TeamCoherenceProps> = ({ isActive }) => {
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Operator 1', coherence: 0 },
    { id: '2', name: 'Operator 2', coherence: 0 },
    { id: '3', name: 'Operator 3', coherence: 0 },
    { id: '4', name: 'Operator 4', coherence: 0 },
  ]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const interval = setInterval(() => {
      setTeam(
        team.map((member) => ({
          ...member,
          coherence: Math.random(),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, team]);

  const teamCoherence = team.reduce((acc, member) => acc + member.coherence, 0) / team.length;

  return (
    <div className="absolute bottom-24 right-6 bg-black/80 p-4 rounded-lg text-white">
      <h3 className="text-lg mb-2">Team Coherence</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span>{teamCoherence.toFixed(2)}</span>
      </div>
      <div className="mt-4">
        {team.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <span>{member.name}</span>
            <span>{member.coherence.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCoherence;
