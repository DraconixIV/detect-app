# Directives d'interface et d'expérience utilisateur

## Règle stricte sur les exemples et placeholders
- **Interdiction absolue de donner des exemples de prénoms inventés** (ex: pas de "Thomas", "Pierre", etc.) dans les formulaires, placeholders, textes d'aide ou réponses.
- **Interdiction absolue de donner des exemples de codes détecteur inventés** (ex: pas de "GEO-AB12CD", "GEO-XXXXXX", etc.) dans les placeholders, messages d'erreur ou textes d'aide.
- Les champs de saisie doivent utiliser des libellés et placeholders descriptifs, neutres et directs :
  - "Prénom ou pseudo"
  - "Code détecteur"
  - "Code de session"
  - "Latitude" / "Longitude"
  - "Nom de la catégorie"

## Règle absolue et définitive : JAMAIS D'ÉMOJI
- **Interdiction absolue d'utiliser des émojis dans l'ensemble du projet** (UI, code, toasts, alertes, boutons, headers, badges, formulaires, modales, etc.).
- Les messages de notification (`alert()`, `setToast()`, `window.__showToast()`) doivent toujours être 100 % textuels, neutres et professionnels (ex: "Sauvegardé", "Trouvaille supprimée avec succès", "Tracé GPS affiché sur la carte").
- Pour l'iconographie, utiliser exclusivement des tracés vectoriels SVG discrets (`TacticalPinIcon`, SVG natifs) ou des pastilles CSS, jamais d'émojis Unicode cartoon.

## Charte visuelle Forest
- Aucun texte en gras (`font-weight: 400` partout).
- Rendu sobre, tactique et militaire : pas d'émojis, pas de fioritures.
- Palette sobre : anthracite `#111915`, fiches `#19231e`, vert forêt `#2c5e4c`, accents sauge `#40916c` / `#80b99c`.
