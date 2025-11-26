import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { LiveConnectionState } from '../types';
import { floatTo16BitPCM, arrayBufferToBase64, base64ToUint8Array, pcmToAudioBuffer } from '../utils/audioUtils';
import { AUDIO_SAMPLE_RATE_INPUT, AUDIO_SAMPLE_RATE_OUTPUT } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const useLiveSession = (systemInstruction: string) => {
  const [status, setStatus] = useState<LiveConnectionState>('disconnected');
  const [volume, setVolume] = useState(0); // For visualization
  const [logs, setLogs] = useState<string[]>([]);
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Audio playback queue
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), msg]);

  const connect = useCallback(async () => {
    try {
      setStatus('connecting');
      addLog('Initializing audio context...');

      // 1. Setup Audio Input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: AUDIO_SAMPLE_RATE_INPUT
      });
      inputContextRef.current = inputCtx;
      
      const source = inputCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      // Use ScriptProcessor for raw PCM access (AudioWorklet is better but more complex to setup in a single file constraint)
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      // 2. Setup Audio Output
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: AUDIO_SAMPLE_RATE_OUTPUT
      });
      audioContextRef.current = outputCtx;

      // 3. Connect to Gemini Live
      addLog('Connecting to Gemini Live...');
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            addLog('Session Connected');
            setStatus('connected');
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && audioContextRef.current) {
                const ctx = audioContextRef.current;
                const pcmData = new Int16Array(base64ToUint8Array(base64Audio).buffer);
                const buffer = pcmToAudioBuffer(pcmData, ctx, AUDIO_SAMPLE_RATE_OUTPUT);
                
                const src = ctx.createBufferSource();
                src.buffer = buffer;
                src.connect(ctx.destination);
                
                // Scheduling
                // Ensure nextStartTime is at least current time to avoid playing in the past
                const currentTime = ctx.currentTime;
                if (nextStartTimeRef.current < currentTime) {
                    nextStartTimeRef.current = currentTime;
                }
                
                src.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                
                sourcesRef.current.add(src);
                src.onended = () => sourcesRef.current.delete(src);
             }
             
             // Handle Interruption
             if (message.serverContent?.interrupted) {
                 addLog('Model Interrupted');
                 sourcesRef.current.forEach(s => s.stop());
                 sourcesRef.current.clear();
                 nextStartTimeRef.current = 0;
             }
          },
          onclose: () => {
            addLog('Session Closed');
            setStatus('disconnected');
          },
          onerror: (err) => {
            console.error(err);
            addLog(`Error: ${err}`);
            setStatus('error');
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

      // 4. Start Processing Input Audio
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for visualizer
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        const rms = Math.sqrt(sum / inputData.length);
        setVolume(rms);

        // Send to model
        const pcm16 = floatTo16BitPCM(inputData);
        const base64Data = arrayBufferToBase64(pcm16);
        
        sessionPromise.then(session => {
            session.sendRealtimeInput({
                media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                }
            });
        });
      };

      source.connect(processor);
      processor.connect(inputCtx.destination); // Required for script processor to run

    } catch (e) {
      console.error(e);
      setStatus('error');
      addLog('Connection failed');
    }
  }, [systemInstruction]);

  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(s => s.close());
    }
    
    // Cleanup Audio
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    inputContextRef.current?.close();
    audioContextRef.current?.close();
    
    setStatus('disconnected');
    setVolume(0);
    addLog('Disconnected by user');
  }, []);

  return { connect, disconnect, status, volume, logs };
};
