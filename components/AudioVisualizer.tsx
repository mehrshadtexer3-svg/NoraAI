import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  volume: number; // 0 to 1
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    // Smooth volume for animation
    let currentVol = 0;

    const render = () => {
      // Approach target volume smoothly
      currentVol += (volume - currentVol) * 0.2;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      if (!isActive) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2 - 10;
      
      // Base circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6'; // Blue 500
      ctx.fill();

      // Pulsing outer ring based on volume
      const pulseRadius = 40 + (currentVol * 100); 
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(pulseRadius, maxRadius), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0.1, 0.8 - currentVol)})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Second ring
       const pulseRadius2 = 40 + (currentVol * 60); 
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(pulseRadius2, maxRadius), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(147, 197, 253, ${Math.max(0.1, 0.6 - currentVol)})`; // Blue 300
      ctx.lineWidth = 2;
      ctx.stroke();
      
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [volume, isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={300} 
      className="w-full max-w-[300px] h-auto mx-auto"
    />
  );
};

export default AudioVisualizer;
