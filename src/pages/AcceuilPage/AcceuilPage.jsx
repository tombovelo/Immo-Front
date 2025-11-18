import React from 'react';
import Accueil from '../../components/organisms/Acceuil/Acceuil';
import styles from './AcceuilPage.module.scss';
import 'leaflet/dist/leaflet.css'; // Ne pas oublier d'importer les styles de Leaflet

const AccueilPage = () => {
    return (
        <div className={styles.container}>
            <Accueil />
        </div>
    );
};

export default AccueilPage;
