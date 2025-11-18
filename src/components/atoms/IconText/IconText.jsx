import styles from "./IconText.module.scss";

export default function IconText({
  icon,
  children,
  color = "",
  iconColor = "",
  textWeight = "normal",
  iconWeight = "normal",
  className = "",
  fontSize,
  iconSize,
  onClick, // Ajout de la prop onClick
}) {
  return (
    <div className={`${styles.container} ${className}`} onClick={onClick}>
      <span className={styles.row}>
        <span
          className={styles.icon}
          style={{ color: iconColor, fontWeight: iconWeight, fontSize: iconSize }}
        >
          {icon}
        </span>
        <span
          className={styles.text}
          style={{ color, fontWeight: textWeight, fontSize: fontSize }}
        >
          {children}
        </span>
      </span> {/* Balise de fermeture qui était manquante */}
    </div>
  );
}
