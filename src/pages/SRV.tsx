import React from 'react';
import Header from '../components/Header';
import GuidedMeditation from '../components/GuidedMeditation';
import TargetCoordinateGenerator from '../components/TargetCoordinateGenerator';
import IdeogramCanvas from '../components/IdeogramCanvas';
import VocabularyBuilder from '../components/VocabularyBuilder';

const SRV = () => {
  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 font-sans">
      <Header title="Scientific Remote Viewing" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider mb-3">
            Coordinate Remote Viewing Protocol
          </span>
          <h1 className="text-3xl sm:text-4xl font-['Syne',sans-serif] font-bold text-white tracking-tight">
            Scientific Remote Viewing (SRV)
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Standardized protocols for intuitive non-local perception, ideogram decoding, and coordinate sensory acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="lg:col-span-1">
            <GuidedMeditation />
          </div>
          <div className="lg:col-span-1">
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
