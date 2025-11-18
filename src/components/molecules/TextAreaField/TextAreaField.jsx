import Label from "../../atoms/Label/Label";
import Textarea from "../../atoms/TextArea/TextArea";
import styles from "./TextAreaField.module.scss";

export default function TextareaField({ label, value, onChange, name, placeholder }) {
  return (
    <div className={styles.field}>
      <Label>{label}</Label>
      <div className={styles.textareaWrapper}>
        <Textarea
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
