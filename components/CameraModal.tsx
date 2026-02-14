import React, { useRef, useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
  instruction: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture, instruction }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      onClose();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg', 0.8);
        onCapture(data.split(',')[1]); // Send only base64 data
        stopCamera();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
          >
            <GlassCard className="p-4 flex flex-col items-center gap-4 bg-obsidian-900/50 border-white/5 shadow-2xl">
              <h3 className="text-xl font-serif text-white">{instruction}</h3>
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-white/10">
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-4 w-full">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={capture} className="flex-1 py-3 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/40">
                  Capture
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};