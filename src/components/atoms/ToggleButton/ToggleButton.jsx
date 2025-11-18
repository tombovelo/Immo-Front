import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./ToggleButton.module.scss";

export default function ToggleButton({ show, onToggle }) {
  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onToggle}
    >
      {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
    </button>
  );
}

