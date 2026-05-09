"use client";

import { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

type DarkAcademiaMusicProps = {
  compact?: boolean;
};

export default function DarkAcademiaMusic({
  compact = false,
}: DarkAcademiaMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);

  function startAmbientTrack() {
    const context = new AudioContext();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(context.destination);

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.01;
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    const notes = [130.81, 164.81, 196.0];
    const oscillators = notes.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.2;
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      oscillator.start();
      return oscillator;
    });

    lfo.start();

    setAudioContext(context);
    setStopFn(() => {
      return () => {
        for (const oscillator of oscillators) {
          oscillator.stop();
          oscillator.disconnect();
        }
        lfo.stop();
        lfo.disconnect();
        lfoGain.disconnect();
        masterGain.disconnect();
        void context.close();
      };
    });
    setIsPlaying(true);
  }

  function stopAmbientTrack() {
    if (stopFn) {
      stopFn();
    }
    if (audioContext && audioContext.state !== "closed") {
      void audioContext.close();
    }
    setAudioContext(null);
    setStopFn(null);
    setIsPlaying(false);
  }

  function togglePlayback() {
    if (isPlaying) {
      stopAmbientTrack();
      return;
    }

    startAmbientTrack();
  }

  if (compact) {
    return (
      <button
        type="button"
        className="music-icon-button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
      </button>
    );
  }

  return (
    <div className="music-control">
      <button type="button" className="music-button" onClick={togglePlayback}>
        {isPlaying ? "Pause ambience" : "Play ambience"}
      </button>
      <p className="music-note">Optional low-volume reading ambience.</p>
    </div>
  );
}
