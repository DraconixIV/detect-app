import React, { useState, useEffect } from 'react';
import { THEMES } from '../styles/themes';
import { BASE_MAPS } from './MapLayers';

export default function MapLayersModal({
  isOpen,
  onClose,
  currentThemeKey = 'tactical',
  baseMap,
  setBaseMap,
  showCadastre,
  setShowCadastre,
  cadastreOpacity,
  setCadastreOpacity,
  showCassini,
  setShowCassini,
  cassiniOpacity,
  setCassiniOpacity,
  showEtatMajor,
  setShowEtatMajor,
  etatMajorOpacity,
  setEtatMajorOpacity
}) {
  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;
  const baseMapList = Object.values(BASE_MAPS);

  // Local draft state to hold temporary selections until user clicks "Appliquer et fermer"
  const [draftBaseMap, setDraftBaseMap] = useState(baseMap);
  const [draftShowCadastre, setDraftShowCadastre] = useState(showCadastre);
  const [draftCadastreOpacity, setDraftCadastreOpacity] = useState(cadastreOpacity);
  const [draftShowCassini, setDraftShowCassini] = useState(showCassini);
  const [draftCassiniOpacity, setDraftCassiniOpacity] = useState(cassiniOpacity);
  const [draftShowEtatMajor, setDraftShowEtatMajor] = useState(showEtatMajor);
  const [draftEtatMajorOpacity, setDraftEtatMajorOpacity] = useState(etatMajorOpacity);

  // Sync draft state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setDraftBaseMap(baseMap);
      setDraftShowCadastre(showCadastre);
      setDraftCadastreOpacity(cadastreOpacity);
      setDraftShowCassini(showCassini);
      setDraftCassiniOpacity(cassiniOpacity);
      setDraftShowEtatMajor(showEtatMajor);
      setDraftEtatMajorOpacity(etatMajorOpacity);
    }
  }, [isOpen, baseMap, showCadastre, cadastreOpacity, showCassini, cassiniOpacity, showEtatMajor, etatMajorOpacity]);

  if (!isOpen) return null;

  // Helper for exclusive overlay selection (only one active at a time in draft state)
  const handleSelectOverlay = (overlayKey) => {
    if (overlayKey === 'cadastre') {
      const next = !draftShowCadastre;
      setDraftShowCadastre(next);
      if (next) {
        setDraftShowCassini(false);
        setDraftShowEtatMajor(false);
      }
    } else if (overlayKey === 'cassini') {
      const next = !draftShowCassini;
      setDraftShowCassini(next);
      if (next) {
        setDraftShowCadastre(false);
        setDraftShowEtatMajor(false);
      }
    } else if (overlayKey === 'etatmajor') {
      const next = !draftShowEtatMajor;
      setDraftShowEtatMajor(next);
      if (next) {
        setDraftShowCadastre(false);
        setDraftShowCassini(false);
      }
    } else if (overlayKey === 'none') {
      setDraftShowCadastre(false);
      setDraftShowCassini(false);
      setDraftShowEtatMajor(false);
    }
  };

  // Commit all draft changes to main state & localStorage upon clicking "Appliquer et fermer"
  const handleApply = () => {
    if (setBaseMap) {
      setBaseMap(draftBaseMap);
      localStorage.setItem('baseMap', draftBaseMap);
    }

    if (setShowCadastre) {
      setShowCadastre(draftShowCadastre);
      localStorage.setItem('showCadastre', String(draftShowCadastre));
    }
    if (setCadastreOpacity) {
      setCadastreOpacity(draftCadastreOpacity);
      localStorage.setItem('cadastreOpacity', String(draftCadastreOpacity));
    }

    if (setShowCassini) {
      setShowCassini(draftShowCassini);
      localStorage.setItem('showCassini', String(draftShowCassini));
    }
    if (setCassiniOpacity) {
      setCassiniOpacity(draftCassiniOpacity);
      localStorage.setItem('cassiniOpacity', String(draftCassiniOpacity));
    }

    if (setShowEtatMajor) {
      setShowEtatMajor(draftShowEtatMajor);
      localStorage.setItem('showEtatMajor', String(draftShowEtatMajor));
    }
    if (setEtatMajorOpacity) {
      setEtatMajorOpacity(draftEtatMajorOpacity);
      localStorage.setItem('etatMajorOpacity', String(draftEtatMajorOpacity));
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '88vh',
          background: '#111915',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '22px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
          color: '#f1f5f2',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '12px'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: "400",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#f1f5f2'
              }}
            >
              Cartes et surcouches IGN
            </h3>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#9aa8a0',
                lineHeight: '1.4'
              }}
            >
              Fonds satellites, parcelles cadastrales officielles et cartes historiques
            </p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'white',
              fontSize: '14px',
              fontWeight: "400",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            overflowY: 'auto',
            paddingRight: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* SECTION 1: FONDS DE CARTE */}
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: "400",
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#ffffff',
                marginBottom: '10px',
                textAlign: 'center'
              }}
            >
              Fond de carte principal (1 au choix)
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}
            >
              {baseMapList.map((bm, idx) => {
                const isSelected = (draftBaseMap === bm.id) || (!draftBaseMap && bm.id === 'satellite');
                const isLastOdd = (idx === baseMapList.length - 1) && (baseMapList.length % 2 === 1);
                return (
                  <button
                    key={bm.id}
                    type="button"
                    onClick={() => {
                      setDraftBaseMap(bm.id);
                    }}
                    style={{
                      gridColumn: isLastOdd ? '1 / -1' : undefined,
                      maxWidth: isLastOdd ? '220px' : undefined,
                      width: '100%',
                      margin: isLastOdd ? '0 auto' : undefined,
                      minHeight: '86px',
                      padding: '12px 10px',
                      borderRadius: '14px',
                      border: isSelected
                        ? '1.5px solid rgba(255, 255, 255, 0.45)'
                        : `1px solid ${c.border || 'rgba(255,255,255,0.1)'}`,
                      background: isSelected
                        ? 'rgba(255, 255, 255, 0.1)'
                        : (c.bgCard || 'rgba(255,255,255,0.04)'),
                      color: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: "400", color: '#ffffff', lineHeight: '1.25' }}>
                      {bm.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.78, lineHeight: '1.25' }}>
                      {bm.desc}
                    </div>
                    {isSelected && (
                      <span
                        style={{
                          fontSize: '8.5px',
                          fontWeight: "400",
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          color: '#ffffff',
                          padding: '1px 7px',
                          borderRadius: '999px',
                          marginTop: '3px',
                          letterSpacing: '0.3px'
                        }}
                      >
                        Actif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SURCOUCHES SUPERPOSABLES (EXCLUSIF - 1 AU CHOIX) */}
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: "400",
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#ffffff',
                marginBottom: '4px',
                textAlign: 'center'
              }}
            >
              Surcouche superposable (1 au choix)
            </div>
            <p style={{ fontSize: '11px', color: '#ffffff', opacity: 0.85, margin: '0 0 10px 0', textAlign: 'center' }}>
              Superposez une couche cadastrale ou historique unique sur votre fond de carte.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 1. Cadastre Officiel IGN */}
              <div
                style={{
                  background: draftShowCadastre ? 'rgba(255, 255, 255, 0.1)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: draftShowCadastre
                    ? '1.5px solid rgba(255, 255, 255, 0.45)'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: "400", color: '#ffffff' }}>
                      Cadastre officiel IGN / DGFiP
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, marginTop: '2px' }}>
                      Limites exactes des parcelles et numéros cadastraux
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectOverlay('cadastre')}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '10px',
                      border: draftShowCadastre ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.12)',
                      background: draftShowCadastre ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: "400",
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    {draftShowCadastre ? 'Actif' : 'Activer'}
                  </button>
                </div>

                {draftShowCadastre && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '4px' }}>
                      <span>Opacité Cadastre</span>
                      <span style={{ color: '#ffffff' }}>{Math.round(draftCadastreOpacity * 100)}%</span>
                    </div>
                    <input
                      type='range'
                      min='0.1'
                      max='1'
                      step='0.05'
                      value={draftCadastreOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setDraftCadastreOpacity(val);
                      }}
                      style={{ width: '100%', accentColor: '#94a3b8', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>

              {/* 2. Carte de Cassini (18e) */}
              <div
                style={{
                  background: draftShowCassini ? 'rgba(255, 255, 255, 0.1)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: draftShowCassini
                    ? '1.5px solid rgba(255, 255, 255, 0.45)'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: "400", color: '#ffffff' }}>
                      Carte de Cassini (XVIIIe siècle - BnF / IGN)
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, marginTop: '2px' }}>
                      Première carte générale du Royaume de France (1750-1815)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectOverlay('cassini')}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '10px',
                      border: draftShowCassini ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.12)',
                      background: draftShowCassini ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: "400",
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    {draftShowCassini ? 'Actif' : 'Activer'}
                  </button>
                </div>

                {draftShowCassini && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '4px' }}>
                      <span>Opacité Cassini</span>
                      <span style={{ color: '#ffffff' }}>{Math.round(draftCassiniOpacity * 100)}%</span>
                    </div>
                    <input
                      type='range'
                      min='0.1'
                      max='1'
                      step='0.05'
                      value={draftCassiniOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setDraftCassiniOpacity(val);
                      }}
                      style={{ width: '100%', accentColor: '#94a3b8', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>

              {/* 3. Carte d'État-Major 1820-1866 (IGN) */}
              <div
                style={{
                  background: draftShowEtatMajor ? 'rgba(255, 255, 255, 0.1)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: draftShowEtatMajor
                    ? '1.5px solid rgba(255, 255, 255, 0.45)'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: "400", color: '#ffffff' }}>
                      Carte de l'état-major (1820 — 1866 - IGN)
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, marginTop: '2px' }}>
                      Cartographie militaire du XIXe siècle (1:40 000)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectOverlay('etatmajor')}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '10px',
                      border: draftShowEtatMajor ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.12)',
                      background: draftShowEtatMajor ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: "400",
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      flexShrink: 0
                    }}
                  >
                    {draftShowEtatMajor ? 'Actif' : 'Activer'}
                  </button>
                </div>

                {draftShowEtatMajor && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '4px' }}>
                      <span>Opacité État-Major</span>
                      <span style={{ color: '#ffffff' }}>{Math.round(draftEtatMajorOpacity * 100)}%</span>
                    </div>
                    <input
                      type='range'
                      min='0.1'
                      max='1'
                      step='0.05'
                      value={draftEtatMajorOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setDraftEtatMajorOpacity(val);
                      }}
                      style={{ width: '100%', accentColor: '#94a3b8', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: ETHIQUE & CADRE LEGAL */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px dashed ${c.border || 'rgba(255,255,255,0.15)'}`,
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: "400", color: '#ffffff' }}>
              Limite légale
            </div>
            <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, lineHeight: '1.4' }}>
              Cette application fournit exclusivement des cartes topographiques, historiques et cadastrales publiques.
              Aucun calque archéologique (DRAC / Patriarche) n'est intégré, pour préserver le patrimoine historique et respecter la législation en vigueur.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleApply}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: '#2c5e4c',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: "400",
              cursor: 'pointer'
            }}
          >
            Appliquer et fermer
          </button>
        </div>
      </div>
    </div>
  );
}
