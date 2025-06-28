
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, X, Play, Mic, Settings } from 'lucide-react';

const FloatingHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      icon: <Play className="w-5 h-5 text-green-400" />,
      title: "Start Your Session",
      description: "Click the play button to begin your focus experience"
    },
    {
      icon: <Mic className="w-5 h-5 text-blue-400" />,
      title: "Enable Microphone",
      description: "Allow mic access for breath coherence tracking"
    },
    {
      icon: <Settings className="w-5 h-5 text-purple-400" />,
      title: "Choose Focus State",
      description: "Select Focus 12, 15, or 21 based on your experience level"
    }
  ];

  return (
    <>
      {/* Help Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-500/80 hover:bg-blue-500 text-white rounded-full w-12 h-12 p-0 shadow-lg backdrop-blur-sm border border-white/20"
        title="Need help?"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      {/* Help Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-black/90 border-white/20 max-w-sm w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">Quick Help</CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{tip.title}</h4>
                    <p className="text-white/70 text-xs mt-1">{tip.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <p className="text-blue-300 text-xs">
                  💡 <strong>Pro Tip:</strong> Use headphones for the best binaural beat experience
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingHelp;
