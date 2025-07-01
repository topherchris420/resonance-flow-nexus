
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, X, Play, Mic, Settings, Sparkles, Brain, Headphones } from 'lucide-react';

const FloatingHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      icon: <Play className="w-6 h-6 text-green-400" />,
      title: "Start Your Journey",
      description: "Click the play button to begin your consciousness exploration experience",
      highlight: "Begin with Focus 12 for beginners"
    },
    {
      icon: <Mic className="w-6 h-6 text-blue-400" />,
      title: "Enable Biofeedback",
      description: "Allow microphone access for breath coherence tracking and personalized resonance patterns",
      highlight: "Greatly enhances the experience"
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "Choose Your State",
      description: "Select Focus 12, 15, or 21 based on your experience level and desired depth",
      highlight: "Each state offers unique benefits"
    },
    {
      icon: <Headphones className="w-6 h-6 text-yellow-400" />,
      title: "Optimal Setup",
      description: "Use quality headphones for the best binaural beat experience and find a quiet space",
      highlight: "Essential for maximum effectiveness"
    }
  ];

  return (
    <>
      {/* Enhanced Help Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white rounded-full w-14 h-14 p-0 shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-110"
        title="Need help getting started?"
      >
        <div className="relative">
          <HelpCircle className="w-7 h-7" />
          <div className="absolute inset-0 animate-ping opacity-30">
            <HelpCircle className="w-7 h-7" />
          </div>
        </div>
      </Button>

      {/* Enhanced Help Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-black/95 to-gray-900/95 border-white/30 max-w-md w-full shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-white text-xl flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <span>Getting Started</span>
              </CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-base mb-2">{tip.title}</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">{tip.description}</p>
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30">
                      <span className="text-blue-300 text-xs font-medium">{tip.highlight}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-8 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-300 text-sm font-semibold mb-1">Pro Tip</p>
                    <p className="text-green-200 text-sm">
                      Start with shorter sessions (10-15 minutes) and gradually increase duration as you become more comfortable with the experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-2 transition-all duration-200 transform hover:scale-105"
                >
                  Start Exploring
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingHelp;
