import React, { useState, useRef, useEffect } from "react";

function formatSecs(s) {
  if (isNaN(s) || s === Infinity || !isFinite(s) || s < 0) return "0:00";
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AudioNotePlayer({
  src,
  duration = null,
  onDelete = null,
  theme = "dark"
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(() => {
    const num = Number(duration);
    return !isNaN(num) && num > 0 ? num : 0;
  });

  useEffect(() => {
    const num = Number(duration);
    if (!isNaN(num) && num > 0) {
      setTotalDuration(num);
    }
  }, [duration]);

  const isLight = theme === "light";
  const bg = isLight ? "#f8fafc" : "rgba(255, 255, 255, 0.05)";
  const borderColor = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const textMain = isLight ? "#0f172a" : "#ffffff";
  const textSub = isLight ? "#64748b" : "#94a3b8";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Audio play error", e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    
    // Check if passed duration is defined
    const hasExplicitDuration = totalDuration > 0;
    if (hasExplicitDuration && cur >= totalDuration) {
      handleEnded();
      return;
    }

    setCurrentTime(hasExplicitDuration ? Math.min(cur, totalDuration) : cur);

    // If no explicit duration was provided, try reading audio.duration
    if (!hasExplicitDuration) {
      const d = audioRef.current.duration;
      if (d && isFinite(d) && d > 0) {
        setTotalDuration(Math.round(d));
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const num = Number(duration);
    if (!isNaN(num) && num > 0) {
      setTotalDuration(num);
      return;
    }
    const d = audioRef.current.duration;
    if (d && isFinite(d) && d > 0) {
      setTotalDuration(Math.round(d));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        borderRadius: "14px",
        background: bg,
        border: `1px solid ${borderColor}`,
        boxSizing: "border-box",
        width: "100%"
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        style={{ display: "none" }}
      />

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={togglePlay}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.16)",
          background: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.1)",
          color: textMain,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          cursor: "pointer",
          flexShrink: 0
        }}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>

      {/* Progress timeline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        <input
          type="range"
          min={0}
          max={totalDuration > 0 ? totalDuration : 1}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: "100%",
            height: "4px",
            accentColor: isLight ? "#0f172a" : "#ffffff",
            cursor: "pointer"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: textSub, fontFamily: "monospace" }}>
          <span>{formatSecs(currentTime)}</span>
          <span>{formatSecs(totalDuration || currentTime)}</span>
        </div>
      </div>

      {/* Delete button (optional) */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          style={{
            background: "transparent",
            border: isLight ? "1px solid #cbd5e1" : "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: "8px",
            color: isLight ? "#64748b" : "#94a3b8",
            width: "26px",
            height: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            cursor: "pointer",
            flexShrink: 0
          }}
          title="Supprimer la note vocale"
        >
          ✕
        </button>
      )}
    </div>
  );
}
