import React from "react";
import AddFindForm from "./AddFindForm";

export default function AddFindModal({
  isOpen,
  onClose,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
  newSubCategory,
  setNewSubCategory,
  icons,
  addFind,
  newPhoto,
  setNewPhoto,
  addingFind,
  customDate,
  setCustomDate,
  customLat,
  setCustomLat,
  customLng,
  setCustomLng
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-end", // Bottom sheet on mobile, centered on large screens
        justifyContent: "center",
        padding: "env(safe-area-inset-top, 12px) 0 0 0",
        animation: "fadeIn 0.2s ease"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "88vh",
          background: "rgba(15, 23, 42, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1.5px solid rgba(255, 255, 255, 0.15)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with drag bar & close */}
        <div
          style={{
            padding: "14px 20px 10px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            position: "relative"
          }}
        >
          {/* Small visual handle bar */}
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.2)",
              marginBottom: "10px"
            }}
          />

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>📍</span>
              <h3
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "17px",
                  fontWeight: "800",
                  letterSpacing: "-0.3px"
                }}
              >
                Nouvelle Trouvaille
              </h3>
            </div>

            <button
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#cbd5e1",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form Body with Smooth Scrolling */}
        <div
          style={{
            padding: "16px 20px 32px 20px",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch"
          }}
        >
          <AddFindForm
            showForm={true}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newDescription={newDescription}
            setNewDescription={setNewDescription}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            newSubCategory={newSubCategory}
            setNewSubCategory={setNewSubCategory}
            icons={icons}
            addFind={async (e) => {
              await addFind(e);
              onClose();
            }}
            newPhoto={newPhoto}
            setNewPhoto={setNewPhoto}
            addingFind={addingFind}
            customDate={customDate}
            setCustomDate={setCustomDate}
            customLat={customLat}
            setCustomLat={setCustomLat}
            customLng={customLng}
            setCustomLng={setCustomLng}
          />
        </div>
      </div>
    </div>
  );
}
