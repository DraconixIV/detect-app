/**
 * Utilitaires de conversion de coordonnées géographiques
 * WGS84 (Lat / Lng) -> UTM (Universal Transverse Mercator)
 */

export function latLngToUtm(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
    return null;
  }

  // Constantes de l'ellipsoïde WGS84
  const a = 6378137.0; // demi-grand axe
  const f = 1 / 298.257223563; // aplatissement
  const b = a * (1 - f); // demi-petit axe
  const e2 = (a * a - b * b) / (a * a); // première excentricité au carré
  const ePrime2 = (a * a - b * b) / (b * b); // deuxième excentricité au carré
  const k0 = 0.9996; // facteur d'échelle du méridien central

  // Conversion degrés -> radians
  const latRad = (lat * Math.PI) / 180.0;
  const lngRad = (lng * Math.PI) / 180.0;

  // Calcul du fuseau UTM (Zone 1 à 60)
  let zoneNumber = Math.floor((lng + 180) / 6) + 1;

  // Exceptions pour certaines zones spécifiques (Norvège / Svalbard)
  if (lat >= 56.0 && lat < 64.0 && lng >= 3.0 && lng < 12.0) {
    zoneNumber = 32;
  }

  // Lettre de bande de latitude UTM (C à X sauf I et O)
  const letters = "CDEFGHJKLMNPQRSTUVWXX";
  let letterIndex = Math.floor((lat + 80) / 8);
  if (letterIndex < 0) letterIndex = 0;
  if (letterIndex > 20) letterIndex = 20;
  const zoneLetter = letters.charAt(letterIndex);

  // Méridien central du fuseau en radians
  const lngOrigin = ((zoneNumber - 1) * 6 - 180 + 3) * (Math.PI / 180.0);

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = ePrime2 * Math.cos(latRad) * Math.cos(latRad);
  const A = Math.cos(latRad) * (lngRad - lngOrigin);

  // Calcul de la distance méridienne M
  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latRad));

  // Calcul de l'Easting (X)
  const x =
    k0 *
      N *
      (A +
        ((1 - T + C) * A * A * A) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ePrime2) * A * A * A * A * A) / 120) +
    500000.0;

  // Calcul du Northing (Y)
  let y =
    k0 *
    (M +
      N *
        Math.tan(latRad) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * A * A * A * A) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ePrime2) * A * A * A * A * A * A) / 720));

  if (lat < 0) {
    y += 10000000.0; // Décalage pour l'hémisphère sud
  }

  return {
    zoneNumber,
    zoneLetter,
    easting: Math.round(x),
    northing: Math.round(y),
    formatted: `${zoneNumber}${zoneLetter} ${Math.round(x)} ${Math.round(y)}`
  };
}

/**
 * Formate des coordonnées GPS en degrés, minutes, secondes (DMS)
 */
export function formatDms(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") return "";

  const formatCoord = (deg, isLat) => {
    const dir = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const minFloat = (abs - d) * 60;
    const m = Math.floor(minFloat);
    const s = ((minFloat - m) * 60).toFixed(2);
    return `${d}°${m}'${s}" ${dir}`;
  };

  return `${formatCoord(lat, true)} ${formatCoord(lng, false)}`;
}
