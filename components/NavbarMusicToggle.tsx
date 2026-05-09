"use client";

import { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function NavbarMusicToggle() {
  const [playing, setPlaying] = useState<boolean | null>(null);

  useEffect(() => {
    function handleState(e: Event) {
      const ev = e as CustomEvent;
      if (ev?.detail?.playing !== undefined) {
        setPlaying(Boolean(ev.detail.playing));
      }
    }

    window.addEventListener("yt-ambient-state", handleState as EventListener);
    // request current state once
    window.dispatchEvent(
      new CustomEvent("yt-ambient-control", { detail: { action: "status" } }),
    );

    return () =>
      window.removeEventListener(
        "yt-ambient-state",
        handleState as EventListener,
      );
  }, []);

  function toggle() {
    if (!playing) {
      // Try to start and unmute (some browsers require a user gesture for unmute)
      window.dispatchEvent(
        new CustomEvent("yt-ambient-control", { detail: { action: "play" } }),
      );
      window.dispatchEvent(
        new CustomEvent("yt-ambient-control", { detail: { action: "unmute" } }),
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("yt-ambient-control", { detail: { action: "toggle" } }),
      );
    }
  }

  return (
    <button
      type="button"
      className="music-icon-button"
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      title={playing ? "Pause music" : "Play music"}
    >
      {playing ? <FaPause size={14} /> : <FaPlay size={14} />}
    </button>
  );
}
