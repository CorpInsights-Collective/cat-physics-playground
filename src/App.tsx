import { useState } from 'react'
import './App.css'
import PhysicsCanvas from './PhysicsCanvas'
import { Button } from './components/ui/Button'

function App() {
  const [resetKey, setResetKey] = useState(0);
  const [gravityMode, setGravityMode] = useState(0); // 0=normal,1=zero,2=reverse
  const [muted, setMuted] = useState(false);
  const [bounciness, setBounciness] = useState(0.8); // Default bounciness

  const cycleGravity = () => {
    const nextMode = (gravityMode + 1) % 3
    setGravityMode(nextMode)
    window.dispatchEvent(new CustomEvent('setGravity', { detail: nextMode }))
  }

  const toggleMute = () => {
    setMuted((m) => {
      const newMuted = !m
      window.dispatchEvent(new CustomEvent('setMuted', { detail: newMuted }))
      return newMuted
    });
  };

  const changeBounciness = (delta: number) => {
    setBounciness((prev) => {
      const newValue = Math.max(0, Math.min(1, prev + delta)); // Clamp between 0 and 1
      window.dispatchEvent(new CustomEvent('setBounciness', { detail: newValue }));
      return newValue;
    });
  };

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Control Panel */}
      <div className="m-4 p-4 rounded-xl shadow-lg backdrop-blur-md bg-white/20 flex flex-wrap gap-2 justify-center items-center">
        <Button
          onClick={() => setResetKey((k) => k + 1)}
          className="mr-2 rounded-full text-lg px-6 py-3 font-bold transition-transform hover:scale-110 bg-pink-500 hover:bg-pink-400 text-white"
        >
          🔄 Restart
        </Button>
        <Button
          onClick={() => window.dispatchEvent(new Event('makeCatsDance'))}
          className="mr-2 rounded-full text-lg px-6 py-3 font-bold transition-transform hover:scale-110 bg-purple-500 hover:bg-purple-400 text-white"
        >
          🐱 Make Cats Dance
        </Button>
        <Button
          onClick={cycleGravity}
          className={`mr-2 rounded-full text-lg px-6 py-3 font-bold transition-transform hover:scale-110 ${
            gravityMode === 0
              ? 'bg-blue-500 hover:bg-blue-400 text-white'
              : gravityMode === 1
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
              : 'bg-red-500 hover:bg-red-400 text-white'
          }`}
        >
          {gravityMode === 0
            ? '🌎 Gravity: Normal'
            : gravityMode === 1
            ? '🪐 Gravity: Zero G'
            : '🚀 Gravity: Reverse'}
        </Button>
        <Button
          onClick={toggleMute}
          className="rounded-full text-lg px-6 py-3 font-bold transition-transform hover:scale-110 bg-green-500 hover:bg-green-400 text-white"
        >
          {muted ? '🔇 Mute' : '🔊 Unmute'}
        </Button>
        {/* Bounciness Controls */}
        <div className="flex items-center gap-1 ml-4">
          <span className="text-sm font-medium text-gray-700">Bounciness:</span>
          <Button onClick={() => changeBounciness(-0.1)} size="sm" variant="outline" className="px-2 py-1">-</Button>
          <span className="text-sm font-bold w-8 text-center">{(bounciness * 100).toFixed(0)}%</span>
          <Button onClick={() => changeBounciness(0.1)} size="sm" variant="outline" className="px-2 py-1">+</Button>
        </div>
      </div>
      {/* Canvas takes remaining space */}
      <div className="flex-grow flex items-center justify-center w-full max-w-4xl">
         <PhysicsCanvas key={resetKey} />
      </div>
      {/* Styled Badge */}
    </div>

    {/* Fixed Badge */}
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-pink-600/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-pink-800 z-50">
      <span className="text-lg font-bold text-white drop-shadow" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
        Made by Whiskers & Mittens ✨
      </span>
    </div>
    </>
  )
}

export default App
