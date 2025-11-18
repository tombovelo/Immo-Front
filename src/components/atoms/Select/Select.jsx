import styles from "./Select.module.scss";

export default function Select({ value, onChange, options = [], ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={styles.select}
      {...props}
    >
      <option value="">-- Sélectionnez une option --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
