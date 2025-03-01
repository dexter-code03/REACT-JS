import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState('mic'); 
  const [audioFile, setAudioFile] = useState(null);
  const [visualizerStyle, setVisualizerStyle] = useState('bars'); 
  const [colorTheme, setColorTheme] = useState('spectrum'); 
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const dataArrayRef = useRef(null);
  
  useEffect(() => {
    const initAudio = async () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    };

    initAudio();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  const setupMicrophone = async () => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      

      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      setIsPlaying(true);
      draw();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check permissions and try again.');
    }
  };
  const setupAudioFile = () => {
    if (!audioFile) return;
    
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
        }

        const audioBuffer = await audioContextRef.current.decodeAudioData(e.target.result);
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }

        sourceRef.current = audioContextRef.current.createBufferSource();
        sourceRef.current.buffer = audioBuffer;
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        sourceRef.current.start(0);
        sourceRef.current.loop = true;
        
        setIsPlaying(true);
        draw();
      } catch (error) {
        console.error('Error decoding audio file:', error);
        alert('Error loading audio file. Please try another file.');
      }
    };
    
    fileReader.readAsArrayBuffer(audioFile);
  };
  
  const togglePlay = async () => {
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current);
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      setIsPlaying(false);
    } else {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      if (audioSource === 'mic') {
        setupMicrophone();
      } else {
        setupAudioFile();
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('audio')) {
      setAudioFile(file);
      setAudioSource('file');
      if (isPlaying) {
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        setupAudioFile();
      }
    }
  };
  
  const changeAudioSource = (source) => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    }
    setAudioSource(source);
  };
  
  const getColor = (value, index, total) => {
    const intensity = value / 255;
    let r, g, b; 
    
    switch (colorTheme) {
      case 'spectrum':
        const hue = (index / total) * 360;
        return `hsl(${hue}, 100%, ${50 + (intensity * 50)}%)`;
        
      case 'monochrome':
        return `rgb(0, ${Math.floor(100 + intensity * 155)}, ${Math.floor(200 + intensity * 55)})`;
        
      case 'gradient':
        const startColor = [255, 0, 127]; 
        const endColor = [0, 255, 255];   
        r = Math.floor(startColor[0] + (endColor[0] - startColor[0]) * intensity);
        g = Math.floor(startColor[1] + (endColor[1] - startColor[1]) * intensity);
        b = Math.floor(startColor[2] + (endColor[2] - startColor[2]) * intensity);
        return `rgb(${r}, ${g}, ${b})`;
        
      case 'sunset':
        const sunsetStart = [255, 100, 0];  
        const sunsetMid = [255, 0, 128];    
        const sunsetEnd = [75, 0, 130];     
        const pos = (index / total) * intensity;
        
        if (pos < 0.5) {
          const ratio = pos * 2;
          r = Math.floor(sunsetStart[0] + (sunsetMid[0] - sunsetStart[0]) * ratio);
          g = Math.floor(sunsetStart[1] + (sunsetMid[1] - sunsetStart[1]) * ratio);
          b = Math.floor(sunsetStart[2] + (sunsetMid[2] - sunsetStart[2]) * ratio);
        } else {
          const ratio = (pos - 0.5) * 2;
          r = Math.floor(sunsetMid[0] + (sunsetEnd[0] - sunsetMid[0]) * ratio);
          g = Math.floor(sunsetMid[1] + (sunsetEnd[1] - sunsetMid[1]) * ratio);
          b = Math.floor(sunsetMid[2] + (sunsetEnd[2] - sunsetMid[2]) * ratio);
        }
        return `rgb(${r}, ${g}, ${b})`;
        
      case 'neon':
        const neonHue = (index / total) * 360;
        const saturation = 100;
        const lightness = 50 + (intensity * 20);
        return `hsl(${neonHue}, ${saturation}%, ${lightness}%)`;
        
      case 'forest':
        const green = Math.floor(100 + intensity * 155);
        const blue = Math.floor(intensity * 100);
        return `rgb(0, ${green}, ${blue})`;
        
      case 'fire':
        const red = Math.floor(200 + intensity * 55);
        const yellow = Math.floor(intensity * 255);
        return `rgb(${red}, ${yellow}, 0)`;
        
      default:
        return `rgb(0, ${Math.floor(intensity * 255)}, ${Math.floor(128 + intensity * 127)})`;
    }
  };
  
  
  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    
    ctx.clearRect(0, 0, rect.width, rect.height);

    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    
    switch (visualizerStyle) {
      case 'bars':
        drawBars(ctx, rect.width, rect.height);
        break;
      case 'circles':
        drawCircles(ctx, rect.width, rect.height);
        break;
      case 'wave':
        drawWave(ctx, rect.width, rect.height);
        break;
      case 'spiral':
        drawSpiral(ctx, rect.width, rect.height);
        break;
      case 'boxes':
        drawBoxes(ctx, rect.width, rect.height);
        break;
      case 'dots':
        drawDots(ctx, rect.width, rect.height);
        break;
      default:
        drawBars(ctx, rect.width, rect.height);
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }
  };
  
  const drawBars = (ctx, width, height) => {
    const bufferLength = dataArrayRef.current.length;
    const barWidth = width / bufferLength * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * height * 0.8;
      
      ctx.fillStyle = getColor(dataArrayRef.current[i], i, bufferLength);
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      
      
      ctx.shadowColor = getColor(dataArrayRef.current[i], i, bufferLength);
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      x += barWidth;
    }
    
    ctx.shadowBlur = 0;
  };
  
  
  const drawCircles = (ctx, width, height) => {
    
    const scale = window.devicePixelRatio;
    ctx.scale(scale, scale);
    width = width / scale;
    height = height / scale;
    
    const bufferLength = dataArrayRef.current.length;
    const centerX = width / 2;
    const centerY = height / 2;
    
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    
    for (let i = 0; i < bufferLength; i++) {
      const amplitude = dataArrayRef.current[i];
      if (amplitude > 5) { 
        const radius = (amplitude / 255) * Math.min(width, height) * 0.4; 
        const angle = (i / bufferLength) * Math.PI * 2;
        
        
        const time = performance.now() * 0.0005; 
        const x = centerX + Math.cos(angle + time) * radius;
        const y = centerY + Math.sin(angle + time) * radius;
        
        
        ctx.beginPath();
        const circleRadius = Math.max(3, (amplitude / 255) * 25); 
        
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, circleRadius);
        const color = getColor(amplitude, i, bufferLength);
        const rgbaColor = color.replace('rgb', 'rgba').replace(')', ', 1)');
        const transparentColor = color.replace('rgb', 'rgba').replace(')', ', 0)');
        
        gradient.addColorStop(0, rgbaColor);    
        gradient.addColorStop(1, transparentColor); 
        
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = Math.min(0.9, amplitude / 200); 
        
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        
        
        if (i > 0) {
          const prevAngle = ((i - 1) / bufferLength) * Math.PI * 2;
          const prevRadius = (dataArrayRef.current[i - 1] / 255) * Math.min(width, height) * 0.3;
          const prevX = centerX + Math.cos(prevAngle + time) * prevRadius;
          const prevY = centerY + Math.sin(prevAngle + time) * prevRadius;
          
          ctx.beginPath();
          ctx.strokeStyle = `${color}88`;
          ctx.lineWidth = 2;
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    }
    
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };
  
  
  const drawWave = (ctx, width, height) => {
    const bufferLength = dataArrayRef.current.length;
    
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    
    for (let i = 0; i < bufferLength; i++) {
      const x = (i / bufferLength) * width;
      const y = height / 2 + ((dataArrayRef.current[i] / 255) * height / 2 - height / 4);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = ((i - 1) / bufferLength) * width;
        const prevY = height / 2 + ((dataArrayRef.current[i - 1] / 255) * height / 2 - height / 4);
        const cpX = (prevX + x) / 2;
        const cpY = (prevY + y) / 2;
        ctx.quadraticCurveTo(cpX, cpY, x, y);
      }
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const midFreq = dataArrayRef.current[Math.floor(bufferLength / 2)];
    const topColor = getColor(255, 0, bufferLength);
    const midColor = getColor(midFreq, Math.floor(bufferLength / 2), bufferLength);
    const bottomColor = getColor(128, bufferLength - 1, bufferLength);
    
    gradient.addColorStop(0, topColor.replace('rgb', 'rgba').replace(')', ', 0.9)'));
    gradient.addColorStop(0.5, midColor.replace('rgb', 'rgba').replace(')', ', 0.7)'));
    gradient.addColorStop(1, bottomColor.replace('rgb', 'rgba').replace(')', ', 0.2)'));
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = topColor.replace('rgb', 'rgba').replace(')', ', 0.7)');
    ctx.shadowColor = midColor.replace('rgb', 'rgba').replace(')', ', 0.8)');
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    
    for (let i = 0; i < bufferLength; i += 4) {
      if (dataArrayRef.current[i] > 150) {
        const x = (i / bufferLength) * width;
        const y = height / 2 + ((dataArrayRef.current[i] / 255) * height / 2 - height / 4);
        
        ctx.beginPath();
        ctx.arc(x, y, 2 + (dataArrayRef.current[i] / 255) * 3, 0, Math.PI * 2);
        ctx.fillStyle = getColor(dataArrayRef.current[i], i, bufferLength)
          .replace('rgb', 'rgba')
          .replace(')', ', 0.8)');
        ctx.fill();
      }
    }
    
    ctx.shadowBlur = 0;
};
  const drawSpiral = (ctx, width, height) => {
    const bufferLength = dataArrayRef.current.length;
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < bufferLength; i++) {
      const amplitude = dataArrayRef.current[i];
      const rotation = (i / bufferLength) * Math.PI * 20;
      const radius = (i / bufferLength) * Math.min(width, height) * 0.4;
      
      const x = centerX + Math.cos(rotation) * radius;
      const y = centerY + Math.sin(rotation) * radius;
      
      const dotSize = (amplitude / 255) * 10;
      
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = getColor(amplitude, i, bufferLength);
      ctx.fill();
      
      if (i > 0) {
        const prevRotation = ((i - 1) / bufferLength) * Math.PI * 20;
        const prevRadius = ((i - 1) / bufferLength) * Math.min(width, height) * 0.4;
        const prevX = centerX + Math.cos(prevRotation) * prevRadius;
        const prevY = centerY + Math.sin(prevRotation) * prevRadius;
        
        ctx.beginPath();
        ctx.strokeStyle = getColor(amplitude, i, bufferLength);
        ctx.lineWidth = amplitude / 255 * 3;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };
  
  const drawBoxes = (ctx, width, height) => {
    const bufferLength = dataArrayRef.current.length;
    const boxSize = Math.min(width, height) / 32;
    const columns = Math.floor(width / boxSize);
    const rows = Math.floor(height / boxSize);
    
    for (let i = 0; i < bufferLength && i < columns * rows; i++) {
      const amplitude = dataArrayRef.current[i];
      const row = Math.floor(i / columns);
      const col = i % columns;
      const x = col * boxSize;
      const y = row * boxSize;
      const size = (amplitude / 255) * boxSize;
      const rotation = (amplitude / 255) * Math.PI;
      
      ctx.save();
      ctx.translate(x + boxSize/2, y + boxSize/2);
      ctx.rotate(rotation);
      ctx.fillStyle = getColor(amplitude, i, bufferLength);
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.restore();
    }
  };
  
  const drawDots = (ctx, width, height) => {
    const bufferLength = dataArrayRef.current.length;
    const time = performance.now() * 0.001;
    
    for (let i = 0; i < bufferLength; i++) {
      const amplitude = dataArrayRef.current[i];
      const angle = (i / bufferLength) * Math.PI * 2 + time;
      const radius = (amplitude / 255) * Math.min(width, height) * 0.3;
      const wobble = Math.sin(time * 2 + i * 0.2) * 20;
      
      const x = width/2 + Math.cos(angle) * (radius + wobble);
      const y = height/2 + Math.sin(angle) * (radius + wobble);
      
      ctx.beginPath();
      ctx.arc(x, y, amplitude / 255 * 8, 0, Math.PI * 2);
      ctx.fillStyle = getColor(amplitude, i, bufferLength);
      ctx.fill();
      
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      const prevAngle = angle - 0.1;
      const prevX = width/2 + Math.cos(prevAngle) * (radius + wobble);
      const prevY = height/2 + Math.sin(prevAngle) * (radius + wobble);
      ctx.lineTo(prevX, prevY);
      ctx.strokeStyle = getColor(amplitude, i, bufferLength);
      ctx.lineWidth = amplitude / 255 * 4;
      ctx.stroke();
    }
  };
  useEffect(() => {
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current);
      draw();
    }
  }, [visualizerStyle, colorTheme]); 
  
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <h1 className="text-4xl font-extrabold text-white text-center py-4 bg-gray-900/50 backdrop-blur flex items-center justify-center gap-3 font-poppins tracking-tight">
          <span className="flex items-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Audio Visualizer
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-10 h-10 animate-pulse ml-3 text-pink-500"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
              />
            </svg>
          </span>
        </h1>
        
        <div className="relative flex-1 w-full">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />
          
          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/30">
              <p className="text-2xl mb-6 text-white font-medium px-4 text-center">
                {audioSource === 'mic' ? 'Click Start to use Microphone' : 
                 audioFile ? `Ready to play: ${audioFile.name}` : 'Select an audio file'}
              </p>
              <button 
                onClick={togglePlay}
                disabled={audioSource === 'file' && !audioFile}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800
                  rounded-full font-bold disabled:opacity-50 transition-all
                  shadow-lg hover:shadow-purple-500/30"
              >
                Start
              </button>
            </div>
          )}
        </div>
        
        
        <div className="bg-gray-900/90 backdrop-blur border-t border-gray-700">
          <div className="max-w-7xl mx-auto p-4 space-y-4">
            
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={togglePlay}
                  className={`px-6 py-2 rounded-lg font-bold transition-all
                    ${isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
                      : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                    } text-white shadow-lg`}
                >
                  {isPlaying ? 'Stop' : 'Start'}
                </button>
                
                <button
                  onClick={() => changeAudioSource('mic')}
                  className={`px-4 py-2 rounded-md font-bold ${audioSource === 'mic' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  Microphone
                </button>
                
                <button
                  onClick={() => changeAudioSource('file')}
                  className={`px-4 py-2 rounded-md font-bold ${audioSource === 'file' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  Audio File
                </button>
              </div>
              
              {audioSource === 'file' && (
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full text-white bg-gray-800/50 rounded-lg p-2
                      file:mr-4 file:py-2 file:px-4 file:rounded-full
                      file:border-0 file:bg-purple-600 file:text-white
                      hover:file:bg-purple-700"
                  />
                </div>
              )}
            </div>
          
            <div className="flex flex-wrap gap-6 justify-between">
              <div className="flex flex-col">
                <label className="text-white mb-1">Visualizer Style</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setVisualizerStyle('bars')}
                    className={`px-3 py-1 rounded ${visualizerStyle === 'bars' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Bars
                  </button>
                  <button
                    onClick={() => setVisualizerStyle('circles')}
                    className={`px-3 py-1 rounded ${visualizerStyle === 'circles' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Circles
                  </button>
                  <button
                    onClick={() => setVisualizerStyle('wave')}
                    className={`px-3 py-1 rounded ${visualizerStyle === 'wave' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Wave
                  </button>
                  <button
                    onClick={() => setVisualizerStyle('spiral')}
                    className={`px-3 py-1 rounded ${visualizerStyle === 'spiral' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Spiral
                  </button>
                  <button
                    onClick={() => setVisualizerStyle('boxes')}
                    className={`px-3 py-1 rounded ${visualizerStyle === 'boxes' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Boxes
                  </button>
                  <button
                    onClick={() => setVisualizerStyle('dots')}
                    className={`px-3 py-1 rounded ${visualizerStyle === 'dots' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Dots
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-white mb-1">Color Theme</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setColorTheme('spectrum')}
                    className={`px-3 py-1 rounded ${colorTheme === 'spectrum' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Spectrum
                  </button>
                  <button
                    onClick={() => setColorTheme('monochrome')}
                    className={`px-3 py-1 rounded ${colorTheme === 'monochrome' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Blues
                  </button>
                  <button
                    onClick={() => setColorTheme('gradient')}
                    className={`px-3 py-1 rounded ${colorTheme === 'gradient' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Gradient
                  </button>
                  <button
                    onClick={() => setColorTheme('sunset')}
                    className={`px-3 py-1 rounded ${colorTheme === 'sunset' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Sunset
                  </button>
                  <button
                    onClick={() => setColorTheme('neon')}
                    className={`px-3 py-1 rounded ${colorTheme === 'neon' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Neon
                  </button>
                  <button
                    onClick={() => setColorTheme('forest')}
                    className={`px-3 py-1 rounded ${colorTheme === 'forest' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Forest
                  </button>
                  <button
                    onClick={() => setColorTheme('fire')}
                    className={`px-3 py-1 rounded ${colorTheme === 'fire' ? 'bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                  >
                    Fire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App

