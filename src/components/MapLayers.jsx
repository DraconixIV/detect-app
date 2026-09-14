import React from "react";
import { TileLayer } from "react-leaflet";

/**
 * Available Base Maps and Transparent Overlays
 */
export const BASE_MAPS = {
  satellite: {
    id: "satellite",
    name: "Satellite HD (Esri)",
    icon: "🛰️",
    desc: "Vue satellite mondiale haute définition",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics",
    maxZoom: 20,
    maxNativeZoom: 19
  },
  ign_ortho: {
    id: "ign_ortho",
    name: "Photos Aériennes IGN (France)",
    icon: "🇫🇷",
    desc: "Orthophotos nationales IGN très haute précision",
    url: "https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg",
    attribution: "&copy; IGN - Orthophotos",
    maxZoom: 20,
    maxNativeZoom: 19
  },
  ign_plan: {
    id: "ign_plan",
    name: "Plan IGN v2 Topo",
    icon: "🌲",
    desc: "Sentiers forestiers, courbes de niveau et voies",
    url: "https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png",
    attribution: "&copy; IGN - Plan IGN v2",
    maxZoom: 20,
    maxNativeZoom: 19
  },
  osm: {
    id: "osm",
    name: "OpenStreetMap Standard",
    icon: "🧭",
    desc: "Plan vectoriel clair et chemins de randonnée",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 20,
    maxNativeZoom: 19
  },
  opentopo: {
    id: "opentopo",
    name: "OpenTopoMap Relief",
    icon: "⛰️",
    desc: "Relief ombragé et courbes altimétriques",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap contributors",
    maxZoom: 20,
    maxNativeZoom: 17
  }
};

export default function MapLayers({
  baseMap = "satellite",
  mapStyle, // backwards compatibility
  showCadastre = false,
  cadastreOpacity = 1.0,
  showCassini = false,
  showHistoricalMap, // backwards compatibility
  cassiniOpacity = 1.0,
  historicalMapOpacity, // backwards compatibility
  showEtatMajor = false,
  etatMajorOpacity = 1.0
}) {
  // Normalize base map: prioritize baseMap prop first
  let effectiveBaseKey = "satellite";
  if (baseMap && BASE_MAPS[baseMap]) {
    effectiveBaseKey = baseMap;
  } else if (mapStyle === "plan" || mapStyle === "streets") {
    effectiveBaseKey = "osm";
  } else if (mapStyle === "satellite") {
    effectiveBaseKey = "satellite";
  }

  const currentBase = BASE_MAPS[effectiveBaseKey] || BASE_MAPS.satellite;

  const isCassiniActive = showCassini || showHistoricalMap;
  const currentCassiniOpacity = cassiniOpacity !== undefined ? cassiniOpacity : (historicalMapOpacity !== undefined ? historicalMapOpacity : 1.0);
  const currentCadastreOpacity = cadastreOpacity !== undefined ? cadastreOpacity : 1.0;
  const currentEtatMajorOpacity = etatMajorOpacity !== undefined ? etatMajorOpacity : 1.0;

  return (
    <>
      {/* 1. Fond de Carte de Base */}
      <TileLayer
        key={`base-${currentBase.id}`}
        attribution={currentBase.attribution}
        url={currentBase.url}
        maxZoom={currentBase.maxZoom || 20}
        maxNativeZoom={currentBase.maxNativeZoom || 19}
        minZoom={0}
        crossOrigin="anonymous"
      />

      {/* 2. Surcouche Carte de Cassini (18e siècle - BnF / IGN) */}
      {isCassiniActive && (
        <TileLayer
          key="overlay-cassini"
          attribution="&copy; IGN, BnF - Cassini"
          url="https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png"
          opacity={currentCassiniOpacity}
          maxZoom={20}
          maxNativeZoom={14}
          minZoom={0}
          updateWhenIdle={true}
          keepBuffer={2}
          crossOrigin="anonymous"
          zIndex={350}
        />
      )}

      {/* 3. Surcouche Carte d'État-Major 1820-1866 (IGN) */}
      {showEtatMajor && (
        <TileLayer
          key="overlay-etat-major"
          attribution="&copy; IGN - État-Major 1820-1866"
          url="https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg"
          opacity={currentEtatMajorOpacity}
          maxZoom={20}
          maxNativeZoom={15}
          minZoom={0}
          updateWhenIdle={true}
          keepBuffer={2}
          crossOrigin="anonymous"
          zIndex={360}
        />
      )}

      {/* 4. Surcouche Cadastre Officiel IGN / DGFiP (Parcellaire Express transparent) */}
      {showCadastre && (
        <TileLayer
          key="overlay-cadastre"
          attribution="&copy; IGN / DGFiP - Cadastre"
          url="https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&STYLE=normal&TILEMATRIXSET=PM_0_19&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png"
          opacity={currentCadastreOpacity}
          maxZoom={22}
          maxNativeZoom={19}
          minZoom={0}
          updateWhenIdle={true}
          keepBuffer={2}
          crossOrigin="anonymous"
          zIndex={400}
        />
      )}
    </>
  );
}