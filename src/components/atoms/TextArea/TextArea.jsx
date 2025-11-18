import styles from "./Textarea.module.scss";

export default function Textarea({ value, onChange, ...props }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={styles.textarea}
      {...props}
    />
  );
}
