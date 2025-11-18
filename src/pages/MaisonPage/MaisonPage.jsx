import MaisonForm from "../../components/organisms/MaisonForm/MaisonForm";
import styles from "./MaisonPage.module.scss";

export default function MaisonPage() {
  return (
    <div className={styles.pageContainer}>
      <MaisonForm />
    </div>
  );
}