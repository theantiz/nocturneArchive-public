"use client";

import { useEffect, useRef, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const value = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setProgress(Math.min(100, value));
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateProgress);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);

    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div
        className="h-full transition-all duration-150"
        style={{ width: `${progress}%`, backgroundColor: "#c99a61" }}
      />
    </div>
  );
}
