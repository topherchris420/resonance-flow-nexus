
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Headphones, Mic, Brain, X } from 'lucide-react';

interface WelcomeOverlayProps {
  onStart: () => void;
  onClose: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Brain className="w-12 h-12 text-blue-400" />,
      title: "Welcome to Hello",
      description: "Your personal focus and meditation companion using binaural beats and resonance technology.",
      highlight: "Experience deep states of consciousness"
    },
    {
      icon: <Headphones className="w-12 h-12 text-purple-400" />,
      title: "How It Works",
      description: "Choose your focus state (12, 15, or 21) and let the app guide you through immersive audio experiences.",
      highlight: "Each state offers unique benefits"
    },
    {
      icon: <Mic className="w-12 h-12 text-green-400" />,
      title: "Enhanced Experience",
      description: "Enable your microphone for breath coherence tracking and personalized resonance patterns.",
      highlight: "Optional but recommended"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStart();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="bg-black/90 border-white/20 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <CardTitle className="text-white text-xl mb-2">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-white/80 text-sm leading-relaxed">
            {steps[currentStep].description}
          </p>
          <div className="mt-3 px-3 py-1 bg-blue-500/20 rounded-full inline-block">
            <span className="text-blue-300 text-xs font-medium">
              {steps[currentStep].highlight}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
            >
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Experience</span>
                </>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xs transition-colors"
            >
              Skip introduction
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeOverlay;
