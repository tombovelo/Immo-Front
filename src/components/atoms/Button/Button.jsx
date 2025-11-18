import styles from "./Button.module.scss";

export default function Button({ children, variant = "", ...props }) {

  const variantClass = styles[variant] || "";

  return (
    <button className={`${styles.button} ${variantClass}`} {...props}>
      {children}
    </button>
  );
}

