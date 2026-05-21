export default function ModernButton({
  children,
  onClick,
  style = {}
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background:
          "linear-gradient(135deg,#1f1f1f,#2d2d2d)",

        color: "white",

        border:
          "1px solid rgba(255,255,255,0.08)",

        padding: "12px",

        borderRadius: "14px",

        fontWeight: "bold",

        cursor: "pointer",

        fontSize: "14px",

        transition: "0.2s",

        boxShadow:
          "0 4px 15px rgba(0,0,0,0.25)",

        ...style
      }}
    >
      {children}
    </button>
  );
}