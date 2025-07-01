
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Headphones, Mic, Brain, X, Sparkles, Waves, Zap } from 'lucide-react';

interface WelcomeOverlayProps {
  onStart: () => void;
  onClose: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      icon: <Brain className="w-16 h-16 text-blue-400" />,
      title: "Welcome to Hello",
      description: "Your personal gateway to deeper consciousness using advanced binaural beats and DRR (Dynamic Resonance Response) technology.",
      highlight: "Experience profound states of awareness",
      details: "Scientifically designed to guide you through Focus 12, 15, and 21 states",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      icon: <Waves className="w-16 h-16 text-purple-400" />,
      title: "How It Works",
      description: "Choose your focus state and let our DRR Engine create personalized resonance patterns that adapt to your breathing and brainwave activity.",
      highlight: "AI-powered personalization",
      details: "Each session is unique and tailored to your current state",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <Headphones className="w-16 h-16 text-green-400" />,
      title: "Optimal Setup",
      description: "For the best experience, use quality headphones and enable your microphone for breath coherence tracking and enhanced resonance.",
      highlight: "Enhanced with biofeedback",
      details: "Microphone access is optional but greatly improves the experience",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: <Sparkles className="w-16 h-16 text-yellow-400" />,
      title: "Ready to Begin",
      description: "Start with Focus 12 for relaxed awareness, or choose Focus 15/21 for deeper explorative states. Your journey into expanded consciousness begins now.",
      highlight: "Your transformation awaits",
      details: "Each state offers unique benefits and experiences",
      gradient: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onStart();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-black/95 to-gray-900/95 border-white/20 max-w-lg w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <CardHeader className="text-center pb-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].gradient} opacity-30 transition-all duration-500`}></div>
          
          <div className={`flex justify-center mb-6 transition-all duration-300 ${isAnimating ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
            <div className="relative">
              {steps[currentStep].icon}
              <div className="absolute inset-0 animate-ping opacity-20">
                {steps[currentStep].icon}
              </div>
            </div>
          </div>
          
          <CardTitle className={`text-white text-2xl mb-4 transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {steps[currentStep].title}
          </CardTitle>
          
          <p className={`text-white/90 text-base leading-relaxed mb-4 transition-all duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {steps[currentStep].description}
          </p>
          
          <div className="mb-3 px-4 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full inline-block backdrop-blur-sm border border-white/20">
            <span className="text-white text-sm font-medium flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>{steps[currentStep].highlight}</span>
            </span>
          </div>
          
          <p className="text-white/70 text-sm">
            {steps[currentStep].details}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-3 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-gradient-to-r from-blue-400 to-purple-400' 
                    : index < currentStep
                    ? 'w-2 bg-green-400'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </Button>
            
            <div className="text-center text-white/60 text-sm">
              {currentStep + 1} of {steps.length}
            </div>
            
            <Button
              onClick={nextStep}
              className={`${
                currentStep === steps.length - 1
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white flex items-center space-x-2 shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Begin Experience</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white/80 text-sm transition-colors underline decoration-white/30 hover:decoration-white/60"
            >
              Skip introduction and explore freely
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeOverlay;
