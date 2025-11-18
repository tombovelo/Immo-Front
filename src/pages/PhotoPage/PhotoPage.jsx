import PhotoForm from "../../components/organisms/PhotoForm/PhotoForm";
import styles from "./PhotoPage.module.scss";

export default function PhotoPage() {
  return (
    <div className={styles.container}>
      <PhotoForm />
    </div>
  );
}