import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  Command,
  Search,
  Keyboard,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface VoiceNavigatorProps {
  onCommandTriggered?: (command: string) => void;
}

export const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({ onCommandTriggered }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastHeardCommand, setLastHeardCommand] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Command map
  const commandMap = [
    {
      keywords: ['scan', 'scans', 'upload', 'assessment', 'analyze'],
      action: () => navigate('/scans'),
      label: 'Scan Assessment Center',
      path: '/scans',
      category: 'Navigation',
    },
    {
      keywords: ['home', 'dashboard', 'overview'],
      action: () => navigate('/'),
      label: 'Clinical Dashboard',
      path: '/',
      category: 'Navigation',
    },
    {
      keywords: ['anatomy', 'brain anatomy', '3d brain', 'brain structure', 'organs'],
      action: () => navigate('/brain-anatomy'),
      label: 'Interactive 3D Brain Anatomy',
      path: '/brain-anatomy',
      category: 'Learning',
    },
    {
      keywords: ['compare', 'sequence', 'sequences', 'slice compare', 'comparison'],
      action: () => navigate('/sequence-compare'),
      label: 'MRI Sequence & Slice Comparison',
      path: '/sequence-compare',
      category: 'Clinical View',
    },
    {
      keywords: ['viva', 'presentation', 'defense', 'slides', 'presentation mode'],
      action: () => navigate('/viva'),
      label: 'Viva Presentation Mode',
      path: '/viva',
      category: 'Academic Defense',
    },
    {
      keywords: ['catalog', 'condition', 'conditions', 'diseases', 'catalog list'],
      action: () => navigate('/catalog'),
      label: 'Brain MRI Condition Catalog',
      path: '/catalog',
      category: 'Reference',
    },
    {
      keywords: ['model coverage', 'models', 'coverage matrix'],
      action: () => navigate('/model-coverage'),
      label: 'Model Coverage Matrix',
      path: '/model-coverage',
      category: 'Reference',
    },
    {
      keywords: ['evaluation', 'accuracy', 'metrics', 'performance'],
      action: () => navigate('/evaluation'),
      label: 'Model Evaluation Metrics',
      path: '/evaluation',
      category: 'Performance',
    },
    {
      keywords: ['dataset', 'dataset explorer', 'samples'],
      action: () => navigate('/dataset'),
      label: 'Dataset Explorer',
      path: '/dataset',
      category: 'Data',
    },
    {
      keywords: ['how it works', 'pipeline', 'architecture'],
      action: () => navigate('/how-it-works'),
      label: 'How AXONOVA Works',
      path: '/how-it-works',
      category: 'Docs',
    },
    {
      keywords: ['student', 'student lab', 'quiz', 'curriculum'],
      action: () => navigate('/student'),
      label: 'Medical Student Lab',
      path: '/student',
      category: 'Learning',
    },
    {
      keywords: ['scroll down', 'page down'],
      action: () => window.scrollBy({ top: 400, behavior: 'smooth' }),
      label: 'Scroll Down',
      path: 'Action',
      category: 'Accessibility',
    },
    {
      keywords: ['scroll up', 'page up'],
      action: () => window.scrollBy({ top: -400, behavior: 'smooth' }),
      label: 'Scroll Up',
      path: 'Action',
      category: 'Accessibility',
    },
    {
      keywords: ['top', 'scroll to top'],
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      label: 'Scroll to Top',
      path: 'Action',
      category: 'Accessibility',
    },
  ];

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K for command palette, ? for shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setShowKeyboardShortcuts((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowKeyboardShortcuts(false);
        setShowPermissionModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const spoken = event.results[last][0].transcript.trim().toLowerCase();
        setTranscript(spoken);
        processVoiceCommand(spoken);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setPermissionError('Microphone access was denied. Please allow microphone access in your browser settings.');
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = (spoken: string) => {
    for (const cmd of commandMap) {
      for (const kw of cmd.keywords) {
        if (spoken.includes(kw)) {
          setLastHeardCommand(cmd.label);
          cmd.action();
          if (onCommandTriggered) {
            onCommandTriggered(cmd.label);
          }
          return;
        }
      }
    }
    setLastHeardCommand(`Unrecognized: "${spoken}"`);
  };

  const handleStartListening = () => {
    setPermissionError(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setShowPermissionModal(false);
    } catch (err: any) {
      setPermissionError('Unable to start speech recognition: ' + err.message);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
    setLastHeardCommand(null);
  };

  const filteredCommands = commandMap.filter(
    (c) =>
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.some((k) => k.includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Floating Accessibility Control Hub */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2">
        {/* Active Listening Indicator */}
        {isListening && (
          <div className="flex items-center space-x-2 bg-slate-900/95 border border-teal-500/50 rounded-full px-3 py-1.5 shadow-xl text-xs text-teal-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="font-mono truncate max-w-[150px]">
              {lastHeardCommand || 'Listening...'}
            </span>
          </div>
        )}

        {/* Command Palette Trigger Button (Visible alternative to voice) */}
        <button
          type="button"
          onClick={() => setShowCommandPalette(true)}
          className="p-3 rounded-full bg-slate-900 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white shadow-lg transition-all"
          title="Open Accessible Command Palette (Ctrl+K)"
          aria-label="Open accessible navigation command palette"
        >
          <Command className="w-4 h-4" />
        </button>

        {/* Voice Navigation Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (isListening) {
              handleStopListening();
            } else {
              setShowPermissionModal(true);
            }
          }}
          className={`p-3 rounded-full transition-all shadow-xl flex items-center justify-center ${
            isListening
              ? 'bg-teal-500 text-slate-950 shadow-teal-glow animate-bounce'
              : 'bg-slate-900 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white'
          }`}
          title={isListening ? 'Stop Voice Navigation' : 'Enable Voice Navigation'}
          aria-label={isListening ? 'Stop Voice Navigation' : 'Enable Voice Navigation'}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Voice Permission & Consent Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <Volume2 className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Voice Navigation Setup</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Voice navigation allows you to navigate AXONOVA hands-free using spoken commands like{' '}
                <strong className="text-teal-300">"Go to scans"</strong>,{' '}
                <strong className="text-teal-300">"Brain anatomy"</strong>, or{' '}
                <strong className="text-teal-300">"Viva mode"</strong>.
              </p>

              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-200 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-teal-300">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Privacy & Local Processing</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Speech recognition is processed entirely inside your web browser. No voice audio
                  is recorded, stored, or sent to any remote servers.
                </p>
              </div>

              {!isSupported && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Browser Note</span>
                  </div>
                  <p className="text-[11px]">
                    Your current browser does not support the Web Speech API. You can use our accessible{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPermissionModal(false);
                        setShowCommandPalette(true);
                      }}
                      className="underline font-bold text-white hover:text-teal-300"
                    >
                      Command Palette (Ctrl+K)
                    </button>{' '}
                    as a full keyboard alternative.
                  </p>
                </div>
              )}

              {permissionError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px]">
                  {permissionError}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPermissionModal(false);
                  setShowCommandPalette(true);
                }}
                className="text-xs text-slate-400 hover:text-white underline font-mono"
              >
                Use Keyboard Alternative
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPermissionModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                {isSupported && (
                  <button
                    type="button"
                    onClick={handleStartListening}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 transition-all shadow-teal-glow flex items-center space-x-1.5"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Grant & Start Listening</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Command Palette Modal (Keyboard Alternative) */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden space-y-0">
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800 space-x-3 bg-slate-950/60">
              <Search className="w-4 h-4 text-teal-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search screens, tasks, or type a voice command..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                ESC to close
              </span>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching screens or actions found for "{searchQuery}".
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      cmd.action();
                      setShowCommandPalette(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-white group-hover:text-teal-300">
                        {cmd.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                        {cmd.category}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                <span>Use keyboard arrows or mouse to select</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowCommandPalette(false);
                  setShowKeyboardShortcuts(true);
                }}
                className="text-teal-400 hover:underline"
              >
                View all shortcuts (?)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Reference Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Keyboard Navigation Shortcuts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyboardShortcuts(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-300">Open Command Palette</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] border border-slate-700">
                  Ctrl + K
                </kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-300">Show Keyboard Shortcuts</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] border border-slate-700">
                  ?
                </kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-300">Close Any Modal</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] border border-slate-700">
                  Esc
                </kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-300">Previous / Next Slide in Viva</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] border border-slate-700">
                  ← / →
                </kbd>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowKeyboardShortcuts(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceNavigator;
