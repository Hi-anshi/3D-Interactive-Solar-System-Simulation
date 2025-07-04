const Labels = ({ label, isDarkMode }) =>
  label.visible ? (
    <div
      style={{
        position: "fixed",
        left: label.x,
        top: label.y,
        color: isDarkMode ? "white" : "black",
        background: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "14px",
        zIndex: 100,
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}
    >
      {label.name}
    </div>
  ) : null;

export default Labels;