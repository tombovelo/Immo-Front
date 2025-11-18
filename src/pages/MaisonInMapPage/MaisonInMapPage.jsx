import { useLocation, Navigate, Link } from 'react-router-dom';
import MaisonInMap from '../../components/organisms/MaisonInMap/MaisonInMap';
import styles from './MaisonInMapPage.module.scss';

export default function MaisonInMapPage() {
    const location = useLocation();
    // location.state peut être null si la page est accédée directement
    const maison = location.state?.maison;

    if (!maison) {
        // Si aucune donnée de maison n'est passée, rediriger vers la liste
        return <Navigate to="/maisons/list" replace />;
    }

    return (
        <MaisonInMap wrapperClassName={styles.mapWrapper} mapContainerClassName={styles.map} maison={maison} zoom={18} />
    );
}
