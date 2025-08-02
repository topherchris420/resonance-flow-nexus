import React from 'react';
import GuidedMeditation from '../components/GuidedMeditation';
import TargetCoordinateGenerator from '../components/TargetCoordinateGenerator';
import IdeogramCanvas from '../components/IdeogramCanvas';
import VocabularyBuilder from '../components/VocabularyBuilder';

const SRV = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Scientific Remote Viewing (SRV)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="md:col-span-1">
            <GuidedMeditation />
          </div>
          <div className="md:col-span-1">
            <TargetCoordinateGenerator />
          </div>
        </div>
        <div className="mb-8">
          <IdeogramCanvas />
        </div>
        <div>
          <VocabularyBuilder />
        </div>
      </div>
    </div>
  );
};

export default SRV;
