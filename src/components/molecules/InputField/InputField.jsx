import { useState } from "react";
import Label from "../../atoms/Label/Label";
import Input from "../../atoms/Input/Input";
import ToggleButton from "../../atoms/ToggleButton/ToggleButton";
import styles from "./InputField.module.scss";

export default function InputField({ label, type, value, onChange, name, error, disabled, previewUrl }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={styles.field}>
      <Label>{label}</Label>
      <div className={styles.inputWrapper}>
        {type === 'file' && previewUrl && (
          <img src={previewUrl} alt="Aperçu" className={styles.previewImage} />
        )}
        <Input
          type={inputType}
          // Pour les champs de type 'file', la prop 'value' est en lecture seule.
          // On la définit à undefined pour éviter les avertissements de React.
          value={type === 'file' ? undefined : value}
          onChange={onChange}
          name={name}
          disabled={disabled} // La prop disabled est passée à l'input natif
        />
        {type === "password" && (
          <ToggleButton
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
