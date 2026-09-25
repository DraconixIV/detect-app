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
          background: c.bgPrimary || '#111827',
          border: `1px solid ${c.border || 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '24px',
          padding: '22px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
          color: c.textPrimary || '#ffffff',
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
            borderBottom: `1px solid ${c.border || 'rgba(255,255,255,0.1)'}`,
            paddingBottom: '12px'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: c.textPrimary || '#ffffff'
              }}
            >
              <span>🗺️</span> Cartes et Surcouches IGN
            </h3>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: c.textSecondary || '#9ca3af',
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
              fontWeight: 'bold',
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
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#ffffff',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Fond de Carte Principal (1 au choix)
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px'
              }}
            >
              {baseMapList.map((bm) => {
                const isSelected = (draftBaseMap === bm.id) || (!draftBaseMap && bm.id === 'satellite');
                return (
                  <button
                    key={bm.id}
                    onClick={() => {
                      setDraftBaseMap(bm.id);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '14px',
                      border: isSelected
                        ? `2px solid ${c.accent || '#ef4444'}`
                        : `1px solid ${c.border || 'rgba(255,255,255,0.1)'}`,
                      background: isSelected
                        ? `${c.accent || '#ef4444'}20`
                        : (c.bgCard || 'rgba(255,255,255,0.04)'),
                      color: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>{bm.name}</div>
                      {isSelected && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '900',
                            background: c.accent || '#ef4444',
                            color: '#ffffff',
                            padding: '2px 5px',
                            borderRadius: '6px',
                            textTransform: 'uppercase'
                          }}
                        >
                          Actif
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, lineHeight: '1.2', marginTop: '2px' }}>
                      {bm.desc}
                    </div>
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
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#ffffff',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Surcouche Superposable (1 au choix)
            </div>
            <p style={{ fontSize: '11px', color: '#ffffff', opacity: 0.85, margin: '0 0 10px 0' }}>
              Superposez une couche cadastrale ou historique unique sur votre fond de carte.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 1. Cadastre Officiel IGN */}
              <div
                style={{
                  background: draftShowCadastre ? 'rgba(16, 185, 129, 0.12)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: draftShowCadastre
                    ? '1.5px solid #10b981'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                      Cadastre Officiel IGN / DGFiP
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, marginTop: '1px' }}>
                      Limites exactes des parcelles et numéros cadastraux
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectOverlay('cadastre')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: draftShowCadastre ? '#10b981' : 'rgba(255,255,255,0.1)',
                      color: draftShowCadastre ? '#ffffff' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {draftShowCadastre ? 'Actif' : 'Activer'}
                  </button>
                </div>

                {draftShowCadastre && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '4px' }}>
                      <span>Opacité Cadastre</span>
                      <strong style={{ color: '#ffffff' }}>{Math.round(draftCadastreOpacity * 100)}%</strong>
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
                      style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>

              {/* 2. Carte de Cassini (18e) */}
              <div
                style={{
                  background: draftShowCassini ? 'rgba(59, 130, 246, 0.12)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: draftShowCassini
                    ? '1.5px solid #3b82f6'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                      Carte de Cassini (XVIIIe siècle - BnF / IGN)
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, marginTop: '1px' }}>
                      Première carte générale du Royaume de France (1750-1815)
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectOverlay('cassini')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: draftShowCassini ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {draftShowCassini ? 'Actif' : 'Activer'}
                  </button>
                </div>

                {draftShowCassini && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '4px' }}>
                      <span>Opacité Cassini</span>
                      <strong style={{ color: '#ffffff' }}>{Math.round(draftCassiniOpacity * 100)}%</strong>
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
                      style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>

              {/* 3. Carte d'État-Major 1820-1866 (IGN) */}
              <div
                style={{
                  background: draftShowEtatMajor ? 'rgba(217, 119, 6, 0.12)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: draftShowEtatMajor
                    ? '1.5px solid #d97706'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                      Carte d'État-Major (1820-1866 - IGN)
                    </div>
                    <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, marginTop: '1px' }}>
                      Cartographie militaire du XIXe siècle (1:40 000)
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectOverlay('etatmajor')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: draftShowEtatMajor ? '#d97706' : 'rgba(255,255,255,0.1)',
                      color: draftShowEtatMajor ? '#ffffff' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {draftShowEtatMajor ? 'Actif' : 'Activer'}
                  </button>
                </div>

                {draftShowEtatMajor && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '4px' }}>
                      <span>Opacité État-Major</span>
                      <strong style={{ color: '#ffffff' }}>{Math.round(draftEtatMajorOpacity * 100)}%</strong>
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
                      style={{ width: '100%', accentColor: '#d97706', cursor: 'pointer' }}
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
              gap: '4px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff' }}>
              Limite légale
            </div>
            <div style={{ fontSize: '10px', color: '#ffffff', opacity: 0.85, lineHeight: '1.4' }}>
              Cette application fournit exclusivement des cartes topographiques, historiques et cadastrales publiques.
              Aucun calque archéologique (DRAC / Patriarche) n'est intégré, pour préserver le patrimoine historique et respecter la législation en vigueur.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: `1px solid ${c.border || 'rgba(255,255,255,0.1)'}`, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleApply}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: `linear-gradient(135deg, ${c.accent || '#ef4444'}, ${c.accentHover || '#dc2626'})`,
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${c.accent || '#ef4444'}44`
            }}
          >
            Appliquer et fermer
          </button>
        </div>
      </div>
    </div>
  );
}
