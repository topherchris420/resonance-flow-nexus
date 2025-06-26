
import { useRef, useCallback } from 'react';

export const useAudioContext = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const fftDataRef = useRef<Float32Array | null>(null);

  const initializeAudioContext = useCallback(async (micEnabled: boolean) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (micEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100
          }
        });
        
        micStreamRef.current = stream;
        const source = audioContext.createMediaStreamSource(stream);
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 8192;
        analyser.smoothingTimeConstant = 0.1;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        
        source.connect(analyser);
        analyserRef.current = analyser;
        
        fftDataRef.current = new Float32Array(analyser.frequencyBinCount);
        
        console.log('DRR Engine initialized with Focus 15 Time Collapse detection');
      }
    } catch (error) {
      console.error('Failed to initialize DRR Engine:', error);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  return {
    audioContextRef,
    analyserRef,
    fftDataRef,
    initializeAudioContext,
    cleanup,
    getSampleRate: () => audioContextRef.current?.sampleRate || 44100
  };
};
