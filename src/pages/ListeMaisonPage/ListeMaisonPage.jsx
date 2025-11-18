import MaisonList from "../../components/organisms/MaisonList/MaisonList";
import styles from "./ListeMaisonPage.module.scss";


export default function ListeMaisonPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <MaisonList />
      </main>
    </div>
  );
}
