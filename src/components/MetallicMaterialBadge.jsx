import React from "react";
import { getMetalConfig } from "../constants/metallicMaterials";

/**
 * MetallicMaterialBadge
 * Renders a physical metallic luster capsule disk with a chemical/numismatic symbol.
 * Completely replaces cartoon system emojis with a professional metallurgical signature.
 */
export default function MetallicMaterialBadge({
  metalName = "",
  emojiOrSymbol = "",
  shade = "",
  size = "md",
  className = "",
  style = {}
}) {
  const config = getMetalConfig(metalName, emojiOrSymbol, shade);

  let dim = 22;
  let fontSz = 10;

  if (size === "xs") {
    dim = 16;
    fontSz = 8;
  } else if (size === "sm") {
    dim = 19;
    fontSz = 9;
  } else if (size === "md") {
    dim = 22;
    fontSz = 10;
  } else if (size === "lg") {
    dim = 26;
    fontSz = 11;
  } else if (size === "xl") {
    dim = 32;
    fontSz = 13;
  } else if (typeof size === "number") {
    dim = size;
    fontSz = Math.round(size * 0.45);
  }

  return (
    <span
      className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        borderRadius: "50%",
        background: config.gradient,
        border: `1px solid ${config.border}`,
        color: config.textColor,
        boxShadow: `inset 0 1px 1.5px rgba(255, 255, 255, 0.45), 0 1px 3px rgba(0, 0, 0, 0.4)`,
        fontSize: `${fontSz}px`,
        fontWeight: "600",
        letterSpacing: "-0.2px",
        lineHeight: 1,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style
      }}
      title={`${config.name} (${config.symbol})`}
    >
      {config.symbol}
    </span>
  );
}
