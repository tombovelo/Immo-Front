import Label from "../../atoms/Label/Label";
import styles from "./SelectField.module.scss";
import Select from 'react-select';

export default function SelectField({ label, name, value, onChange, options, error, isDisabled }) {
  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name,
        value: selectedOption?.value || ''
      }
    });
  };

  // Trouve l'option correspondante pour l'afficher dans le champ
  const selectedValue = options.find(opt => opt.value == value);

  return (
    <div className={styles.field}>
      <Label>{label}</Label>
      <Select
        classNamePrefix="custom-select" // Préfixe pour le ciblage CSS
        options={options}
        value={selectedValue}
        onChange={handleChange}
        placeholder="Sélectionner"
        isSearchable={false}
        isDisabled={isDisabled}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
