import styles from "./Label.module.scss";

export default function Label({ children }) {
  return <label className={styles.label}>{children}</label>;
}
