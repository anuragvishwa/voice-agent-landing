import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, PhoneOff, Loader2, AlertCircle, User, Bot } from 'lucide-react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
} from '@livekit/components-react';
import '@livekit/components-styles';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://voice-sdk-m8va715z.livekit.cloud';
const TOKEN_SERVER_URL = import.meta.env.VITE_TOKEN_SERVER_URL || 'http://localhost:3001';
const TOKEN_API_KEY = import.meta.env.VITE_TOKEN_API_KEY || '';

// Idle state - Start button with pulsing effect
function IdleState({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Pulsing rings */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

        <button
          onClick={onStart}
          className="relative z-10 w-24 h-24 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
        >
          <Phone className="w-10 h-10" />
        </button>
      </div>

      <p className="mt-8 text-white font-medium text-lg">Start Demo</p>
      <p className="mt-2 text-white/50 text-sm">Talk to our AI — no signup required</p>
    </div>
  );
}

// Connecting state - Loading spinner
function ConnectingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>

      <p className="mt-8 text-white font-medium text-lg">Connecting...</p>
      <p className="mt-2 text-white/50 text-sm">Setting up your call with our AI receptionist</p>
    </div>
  );
}

// Error state - Error message with retry
function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>

      <p className="mt-8 text-white font-medium text-lg">Connection Error</p>
      <p className="mt-2 text-white/50 text-sm max-w-sm text-center">
        {error || 'Unable to connect to the voice service. Please try again.'}
      </p>

      <button
        onClick={onRetry}
        className="mt-6 px-6 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

// Transcript message component
function TranscriptMessage({ message, isAgent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isAgent ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/60'
      }`}>
        {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message bubble */}
      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
        isAgent
          ? 'bg-white/[0.05] text-white/80 rounded-tl-sm'
          : 'bg-primary/20 text-white/90 rounded-tr-sm'
      }`}>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// Voice assistant view - Shows when connected
function VoiceAssistantView({ onEnd }) {
  const { state, audioTrack, agentTranscriptions, userTranscriptions } = useVoiceAssistant();
  const [transcript, setTranscript] = useState([]);
  const transcriptRef = useRef(null);

  // Build transcript from agent and user transcriptions
  useEffect(() => {
    const messages = [];

    // Add agent messages
    agentTranscriptions?.forEach((t, i) => {
      if (t.text) {
        messages.push({
          id: `agent-${i}-${t.firstReceivedTime || i}`,
          text: t.text,
          isAgent: true,
          timestamp: t.firstReceivedTime || Date.now(),
          isFinal: t.final !== false,
        });
      }
    });

    // Add user messages
    userTranscriptions?.forEach((t, i) => {
      if (t.text) {
        messages.push({
          id: `user-${i}-${t.firstReceivedTime || i}`,
          text: t.text,
          isAgent: false,
          timestamp: t.firstReceivedTime || Date.now(),
          isFinal: t.final !== false,
        });
      }
    });

    // Sort by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);

    setTranscript(messages);
  }, [agentTranscriptions, userTranscriptions]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Map agent state to display text
  const getStateDisplay = () => {
    switch (state) {
      case 'listening':
        return { text: 'Listening', color: 'text-primary', dotColor: 'bg-primary' };
      case 'thinking':
        return { text: 'Processing', color: 'text-amber-400', dotColor: 'bg-amber-400' };
      case 'speaking':
        return { text: 'Speaking', color: 'text-primary', dotColor: 'bg-primary animate-pulse' };
      default:
        return { text: 'Ready', color: 'text-white/60', dotColor: 'bg-white/40' };
    }
  };

  const stateDisplay = getStateDisplay();

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header with status and visualizer */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        {/* Agent status */}
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] font-mono text-xs uppercase tracking-widest ${stateDisplay.color}`}>
          <span className={`w-2 h-2 rounded-full ${stateDisplay.dotColor}`} />
          {stateDisplay.text}
        </span>

        {/* Mini visualizer */}
        <div className="flex items-center gap-2">
          {audioTrack ? (
            <BarVisualizer
              state={state}
              trackRef={audioTrack}
              barCount={8}
              options={{ minHeight: 4 }}
              className="w-16 h-8"
            />
          ) : (
            <div className="flex items-center gap-0.5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-primary/40 rounded-full"
                  style={{ height: 4 + Math.random() * 12 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transcript area */}
      <div
        ref={transcriptRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {transcript.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40 text-sm">Waiting for conversation to start...</p>
          </div>
        ) : (
          transcript.map((msg) => (
            <TranscriptMessage
              key={msg.id}
              message={msg.text}
              isAgent={msg.isAgent}
            />
          ))
        )}

        {/* Typing indicator when agent is thinking */}
        {state === 'thinking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-center">
          {/* End call button */}
          <button
            onClick={onEnd}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        <p className="mt-3 text-center text-white/40 text-xs">
          Speak naturally — the AI will respond
        </p>
      </div>
    </div>
  );
}

// Connected state wrapper with LiveKit room
function ConnectedState({ token, serverUrl, onEnd, onError }) {
  // Debug: log connection params
  useEffect(() => {
    console.log('ConnectedState mounting with:', {
      serverUrl: serverUrl || LIVEKIT_URL,
      tokenLength: token?.length,
      tokenPreview: token?.substring(0, 50) + '...',
    });
  }, [token, serverUrl]);

  const wsUrl = serverUrl || LIVEKIT_URL;

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={true}
      audio={true}
      video={false}
      options={{
        adaptiveStream: true,
        dynacast: true,
      }}
      onConnected={() => {
        console.log('LiveKit: Successfully connected!');
      }}
      onDisconnected={(reason) => {
        console.log('LiveKit: Disconnected, reason:', reason);
        onEnd();
      }}
      onError={(error) => {
        console.error('LiveKit connection error:', error);
        console.error('Error details:', {
          name: error?.name,
          message: error?.message,
          code: error?.code,
          stack: error?.stack,
        });
        onError(error?.message || 'Connection lost');
      }}
    >
      <VoiceAssistantView onEnd={onEnd} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

// Main component
export function LiveVoiceDemo() {
  const [demoState, setDemoState] = useState('idle'); // idle | connecting | connected | error
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    setDemoState('connecting');
    setError(null);

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Fetch token from token server
      const response = await fetch(`${TOKEN_SERVER_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TOKEN_API_KEY,
        },
        body: JSON.stringify({ agentName: 'blanc-receptionist' }),
      });

      if (!response.ok) {
        throw new Error('Failed to get connection token');
      }

      const data = await response.json();
      console.log('Token response:', { room: data.room, serverUrl: data.serverUrl, tokenLength: data.token?.length });
      setToken(data.token);
      setServerUrl(data.serverUrl);
      setDemoState('connected');
    } catch (err) {
      console.error('Demo start error:', err);
      setError(err.message || 'Failed to start demo');
      setDemoState('error');
    }
  };

  const handleEnd = () => {
    setToken(null);
    setDemoState('idle');
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setDemoState('error');
  };

  const handleRetry = () => {
    setError(null);
    setDemoState('idle');
  };

  return (
    <section id="live-demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <Mic className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/60">
              Try It Now
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Talk to our AI receptionist
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Click the button to start a live conversation. Describe your emergency and experience real-time intake.
          </p>
        </motion.div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {demoState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <IdleState onStart={handleStart} />
              </motion.div>
            )}
            {demoState === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConnectingState />
              </motion.div>
            )}
            {demoState === 'connected' && token && (
              <motion.div
                key="connected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConnectedState token={token} serverUrl={serverUrl} onEnd={handleEnd} onError={handleError} />
              </motion.div>
            )}
            {demoState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState error={error} onRetry={handleRetry} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Demo Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid sm:grid-cols-3 gap-4 text-center"
        >
          <div className="text-white/40 text-sm">
            <span className="text-primary font-mono">1.</span> Click "Start Demo"
          </div>
          <div className="text-white/40 text-sm">
            <span className="text-primary font-mono">2.</span> Allow microphone access
          </div>
          <div className="text-white/40 text-sm">
            <span className="text-primary font-mono">3.</span> Describe your emergency
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-white/30 text-xs">
          This is a demo. No real dispatches are made. Your audio is processed in real-time and not stored.
        </p>
      </div>
    </section>
  );
}
