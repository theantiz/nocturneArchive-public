"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nocturne-reading-font-size";

const FONT_SIZES = [
  { value: "0.98rem" },
  { value: "1.08rem" },
  { value: "1.2rem" },
] as const;

type FontSizeValue = (typeof FONT_SIZES)[number]["value"];

const DEFAULT_INDEX = 1;

export default function ReadingTextSizeControl() {
  const [fontSize, setFontSize] = useState<FontSizeValue>(
    FONT_SIZES[DEFAULT_INDEX].value,
  );
  const [hydrated, setHydrated] = useState(false);

  const currentIndex = FONT_SIZES.findIndex((option) => option.value === fontSize);
  const safeIndex = currentIndex === -1 ? DEFAULT_INDEX : currentIndex;
  const canDecrease = safeIndex > 0;
  const canIncrease = safeIndex < FONT_SIZES.length - 1;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && FONT_SIZES.some((option) => option.value === saved)) {
      setFontSize(saved as FontSizeValue);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    document.documentElement.style.setProperty("--reading-font-size", fontSize);
    window.localStorage.setItem(STORAGE_KEY, fontSize);

    return () => {
      document.documentElement.style.removeProperty("--reading-font-size");
    };
  }, [fontSize, hydrated]);

  const decreaseSize = () => {
    if (!canDecrease) {
      return;
    }

    setFontSize(FONT_SIZES[safeIndex - 1].value);
  };

  const increaseSize = () => {
    if (!canIncrease) {
      return;
    }

    setFontSize(FONT_SIZES[safeIndex + 1].value);
  };

  return (
    <div className="reading-tools reading-size-control" aria-label="Text size controls">
      <button
        type="button"
        className="focus-button reading-size-button"
        aria-label="Decrease text size"
        title="Decrease text size"
        disabled={!canDecrease}
        onClick={decreaseSize}
      >
        −
      </button>
      <button
        type="button"
        className="focus-button reading-size-button"
        aria-label="Increase text size"
        title="Increase text size"
        disabled={!canIncrease}
        onClick={increaseSize}
      >
        +
      </button>
    </div>
  );
}