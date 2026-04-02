"use client";

import { useState, useRef, useEffect } from "react";

type AudioPlayerProps = {
  src: string;
  title: string;
  category: string;
  duration: string;
};

export default function AudioPlayer({ src, title, category, duration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60)
          .toString()
          .padStart(2, "0");
        setCurrentTime(`${mins}:${secs}`);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const value = Number(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  return (
    <div className="bg-studio-gray border border-white/5 rounded-lg p-5 hover:border-gold/20 transition-all duration-300">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-white font-medium text-sm">{title}</h4>
          <span className="text-gold text-xs uppercase tracking-wider">{category}</span>
        </div>
        <span className="text-gray-500 text-xs">{duration}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gold text-studio-black hover:bg-gold-light transition-colors flex-shrink-0"
          aria-label={isPlaying ? `Pausar ${title}` : `Reproducir ${title}`}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-gray-500 text-xs w-10 text-right">{currentTime}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="flex-1 cursor-pointer"
            aria-label={`Progreso de ${title}`}
          />
        </div>
      </div>
    </div>
  );
}
