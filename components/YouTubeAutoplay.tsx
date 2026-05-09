"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoId: string;
  startMuted?: boolean;
};

// Simple promise to wait for YT API ready
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

let ytApiPromise: Promise<void> | null = null;
function ensureYouTubeApiLoaded() {
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();

    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    window.onYouTubeIframeAPIReady = () => resolve();

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });

  return ytApiPromise;
}

export default function YouTubeAutoplay({ videoId, startMuted = false }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(startMuted);

  useEffect(() => {
    let mounted = true;

    ensureYouTubeApiLoaded().then(() => {
      if (!mounted || !containerRef.current) return;

      // create player
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "1",
        width: "1",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          mute: startMuted ? 1 : 0,
        },
        events: {
          onReady: () => {
            setIsReady(true);
            try {
              if (startMuted) {
                playerRef.current.mute();
              } else {
                playerRef.current.unMute();
              }
              playerRef.current.setVolume(50);
              playerRef.current.playVideo();
            } catch (e) {}
            window.dispatchEvent(
              new CustomEvent("yt-ambient-state", {
                detail: { playing: true, muted: !!startMuted },
              }),
            );
          },
          onStateChange: (event: any) => {
            // If unmuted autoplay was blocked, browser pauses the video (state -1 or 2)
            // Try falling back to muted autoplay so music still starts
            if (!startMuted && !isMuted && event.data === -1) {
              try {
                playerRef.current.mute();
                playerRef.current.playVideo();
                setIsMuted(true);
                window.dispatchEvent(
                  new CustomEvent("yt-ambient-state", {
                    detail: { playing: true, muted: true },
                  }),
                );
              } catch (e) {}
            }
          },
        },
      });
    });

    function handleControl(e: Event) {
      const ev = e as CustomEvent;
      const action = ev?.detail?.action;
      if (!playerRef.current || !isReady) return;

      if (action === "toggle") {
        const state = playerRef.current.getPlayerState();
        if (state === 1) {
          playerRef.current.pauseVideo();
          window.dispatchEvent(
            new CustomEvent("yt-ambient-state", { detail: { playing: false } }),
          );
        } else {
          playerRef.current.playVideo();
          window.dispatchEvent(
            new CustomEvent("yt-ambient-state", { detail: { playing: true } }),
          );
        }
      } else if (action === "mute") {
        playerRef.current.mute();
        setIsMuted(true);
        window.dispatchEvent(
          new CustomEvent("yt-ambient-state", { detail: { muted: true } }),
        );
      } else if (action === "unmute") {
        playerRef.current.unMute();
        playerRef.current.setVolume(50);
        setIsMuted(false);
        window.dispatchEvent(
          new CustomEvent("yt-ambient-state", { detail: { muted: false } }),
        );
      } else if (action === "stop") {
        playerRef.current.stopVideo();
        window.dispatchEvent(
          new CustomEvent("yt-ambient-state", { detail: { playing: false } }),
        );
      } else if (action === "play") {
        playerRef.current.playVideo();
        window.dispatchEvent(
          new CustomEvent("yt-ambient-state", { detail: { playing: true } }),
        );
      } else if (action === "status") {
        const state = playerRef.current.getPlayerState();
        const isPlaying = state === 1;
        window.dispatchEvent(
          new CustomEvent("yt-ambient-state", {
            detail: { playing: isPlaying },
          }),
        );
      }
    }

    window.addEventListener(
      "yt-ambient-control",
      handleControl as EventListener,
    );

    return () => {
      mounted = false;
      window.removeEventListener(
        "yt-ambient-control",
        handleControl as EventListener,
      );
      try {
        if (playerRef.current) playerRef.current.destroy();
      } catch (e) {}
    };
  }, [videoId, isReady, startMuted, isMuted]);

  return (
    <div className="yt-ambient-frame" aria-hidden>
      <div ref={containerRef} />
    </div>
  );
}
