import Actualite from '../../components/organisms/Actualite/Actualite';
import styles from './ActualitePage.module.scss'

export default function ActualitePage() {
  return (
    <div className={styles.homePage}>
      <Actualite />
    </div>
  );
}