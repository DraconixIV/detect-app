import React from 'react';
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
  if (!isOpen) return null;

  const theme = THEMES[currentThemeKey] || THEMES.tactical;
  const c = theme.colors;
  const baseMapList = Object.values(BASE_MAPS);

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
              <span>🥞</span> Cartes & Surcouches IGN
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
                color: c.accent || '#ef4444',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🗺️</span> Fond de Carte Principal (1 au choix)
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px'
              }}
            >
              {baseMapList.map((bm) => {
                const isSelected = (baseMap === bm.id) || (!baseMap && bm.id === 'satellite');
                return (
                  <button
                    key={bm.id}
                    onClick={() => {
                      setBaseMap(bm.id);
                      localStorage.setItem('baseMap', bm.id);
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
                      color: c.textPrimary || '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '18px' }}>{bm.icon}</span>
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
                    <div style={{ fontSize: '12px', fontWeight: '800', marginTop: '2px' }}>{bm.name}</div>
                    <div style={{ fontSize: '10px', color: c.textSecondary || '#9ca3af', lineHeight: '1.2' }}>
                      {bm.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SURCOUCHES OFFICIELLES & HISTORIQUES */}
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: c.accentSecondary || '#f97316',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📐</span> Surcouches Superposables (Multi-sélection)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 1. Cadastre Officiel IGN */}
              <div
                style={{
                  background: showCadastre ? 'rgba(16, 185, 129, 0.12)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: showCadastre
                    ? '1.5px solid #10b981'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📐</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: showCadastre ? '#34d399' : c.textPrimary }}>
                        Cadastre Officiel IGN / DGFiP
                      </div>
                      <div style={{ fontSize: '10px', color: c.textSecondary, marginTop: '1px' }}>
                        Limites exactes des parcelles et numéros cadastraux
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !showCadastre;
                      setShowCadastre(next);
                      localStorage.setItem('showCadastre', String(next));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: showCadastre ? '#10b981' : 'rgba(255,255,255,0.1)',
                      color: showCadastre ? '#ffffff' : '#9ca3af',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {showCadastre ? 'ON' : 'OFF'}
                  </button>
                </div>

                {showCadastre && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: c.textSecondary, marginBottom: '4px' }}>
                      <span>Opacité Cadastre</span>
                      <strong style={{ color: '#34d399' }}>{Math.round(cadastreOpacity * 100)}%</strong>
                    </div>
                    <input
                      type='range'
                      min='0.1'
                      max='1'
                      step='0.05'
                      value={cadastreOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCadastreOpacity(val);
                        localStorage.setItem('cadastreOpacity', String(val));
                      }}
                      style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', fontStyle: 'italic' }}>
                      💡 Essentiel pour vérifier les limites de champs et respecter les autorisations des propriétaires.
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Carte de Cassini (18e) */}
              <div
                style={{
                  background: showCassini ? 'rgba(59, 130, 246, 0.12)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: showCassini
                    ? '1.5px solid #3b82f6'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📜</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: showCassini ? '#60a5fa' : c.textPrimary }}>
                        Carte de Cassini (XVIIIe siècle - BnF / IGN)
                      </div>
                      <div style={{ fontSize: '10px', color: c.textSecondary, marginTop: '1px' }}>
                        Première carte générale du Royaume de France (1750-1815)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !showCassini;
                      setShowCassini(next);
                      localStorage.setItem('showCassini', String(next));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: showCassini ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      color: showCassini ? '#ffffff' : '#9ca3af',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {showCassini ? 'ON' : 'OFF'}
                  </button>
                </div>

                {showCassini && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: c.textSecondary, marginBottom: '4px' }}>
                      <span>Opacité Cassini</span>
                      <strong style={{ color: '#60a5fa' }}>{Math.round(cassiniOpacity * 100)}%</strong>
                    </div>
                    <input
                      type='range'
                      min='0.1'
                      max='1'
                      step='0.05'
                      value={cassiniOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCassiniOpacity(val);
                        localStorage.setItem('cassiniOpacity', String(val));
                      }}
                      style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', fontStyle: 'italic' }}>
                      💡 Permet de repérer les anciens moulins, hameaux disparus et voies d'époque.
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Carte d'État-Major 1820-1866 (IGN) */}
              <div
                style={{
                  background: showEtatMajor ? 'rgba(217, 119, 6, 0.12)' : (c.bgCard || 'rgba(255,255,255,0.04)'),
                  border: showEtatMajor
                    ? '1.5px solid #d97706'
                    : `1px solid ${c.border || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>⚔️</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: showEtatMajor ? '#fbbf24' : c.textPrimary }}>
                        Carte d'État-Major (1820-1866 - IGN)
                      </div>
                      <div style={{ fontSize: '10px', color: c.textSecondary, marginTop: '1px' }}>
                        Cartographie militaire du XIXe siècle (1:40 000)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !showEtatMajor;
                      setShowEtatMajor(next);
                      localStorage.setItem('showEtatMajor', String(next));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: showEtatMajor ? '#d97706' : 'rgba(255,255,255,0.1)',
                      color: showEtatMajor ? '#ffffff' : '#9ca3af',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {showEtatMajor ? 'ON' : 'OFF'}
                  </button>
                </div>

                {showEtatMajor && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: c.textSecondary, marginBottom: '4px' }}>
                      <span>Opacité État-Major</span>
                      <strong style={{ color: '#fbbf24' }}>{Math.round(etatMajorOpacity * 100)}%</strong>
                    </div>
                    <input
                      type='range'
                      min='0.1'
                      max='1'
                      step='0.05'
                      value={etatMajorOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEtatMajorOpacity(val);
                        localStorage.setItem('etatMajorOpacity', String(val));
                      }}
                      style={{ width: '100%', accentColor: '#d97706', cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', fontStyle: 'italic' }}>
                      💡 Idéale pour comparer les anciens tracés de chemins vicinaux, parcelles et limites forestières du XIXe siècle.
                    </div>
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
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: c.textPrimary || '#ffffff', marginBottom: '2px' }}>
                Charte Éthique & Limite Légale
              </div>
              <div style={{ fontSize: '10px', color: c.textSecondary || '#9ca3af', lineHeight: '1.4' }}>
                Cette application fournit exclusivement des cartes topographiques, historiques et cadastrales publiques.
                Aucun calque archéologique (DRAC / Patriarche) n'est intégré, pour préserver le patrimoine historique et respecter la législation en vigueur.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: `1px solid ${c.border || 'rgba(255,255,255,0.1)'}`, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
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
            Appliquer & Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
