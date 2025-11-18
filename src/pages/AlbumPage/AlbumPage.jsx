import AlbumForm from "../../components/organisms/AlbumForm/AlbumForm";
import styles from './AlbumPage.module.scss'

export default function AlbumPage() {
  return (
    <div className={styles.container}>
      <AlbumForm />
    </div>
  );
}