import React, { useEffect, useRef } from 'react';
import { VibeStats } from '../types';

interface SoundscapeProps {
  vibe: VibeStats;
}

export const Soundscape: React.FC<SoundscapeProps> = ({ vibe }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    const startAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Ethereal base layer
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        const filter = audioCtxRef.current.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, audioCtxRef.current.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, audioCtxRef.current.currentTime);
        
        gain.gain.setValueAtTime(0.02, audioCtxRef.current.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainRef.current = gain;
        filterRef.current = filter;
      }
    };

    window.addEventListener('click', startAudio, { once: true });
    return () => {
      oscillatorRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (audioCtxRef.current && oscillatorRef.current && filterRef.current) {
      const time = audioCtxRef.current.currentTime;
      // Shift frequency based on Playful/Deep
      const freq = 40 + (vibe.deep * 0.5) - (vibe.playful * 0.2);
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(Math.max(20, freq), time + 2);
      
      // Shift filter based on Flirty/Comfortable
      const filterFreq = 200 + (vibe.flirty * 10);
      filterRef.current.frequency.exponentialRampToValueAtTime(filterFreq, time + 2);
    }
  }, [vibe]);

  return null;
};