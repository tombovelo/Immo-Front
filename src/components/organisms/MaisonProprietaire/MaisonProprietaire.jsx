import React from 'react';
import styles from './MaisonProprietaire.module.scss';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome, FaList, FaMap } from 'react-icons/fa';
import MaisonCard from '../../molecules/MaisonCard/MaisonCard';
import { useState } from 'react';
import MaisonListMap from '../MaisonListMap/MaisonListMap'; // Assurez-vous que le chemin est correct


const MaisonProprietaire = ({ proprietaire }) => {

    const [viewMode, setViewMode] = useState('list'); // 'list' ou 'map'

    if (!proprietaire) {
        return <div>Propriétaire non trouvé.</div>;
    }

    const { id, nom, prenom, telephone, adresse, urlProfile, utilisateur, maisons } = proprietaire;

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.header}>
                <div className={styles.infoProfile}>
                    <img src={urlProfile || 'https://via.placeholder.com/150'} alt={`Profil de ${nom}`} className={styles.profileImage} />
                    <div className={styles.headerInfo}>
                        <h1 className={styles.name}>{prenom} {nom}</h1>
                        <p className={styles.role}>{utilisateur?.role?.replace('ROLE_', '').replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <FaEnvelope className={styles.icon} />
                    <span>
                        {utilisateur?.email ? (
                            <a href={`mailto:${utilisateur.email}`}>{utilisateur.email}</a>
                        ) : (
                            'Non renseigné'
                        )}
                    </span>
                </div>
                <div className={styles.infoItem}>
                    <FaPhone className={styles.icon} />
                    <span>
                        {telephone ? (
                            <a href={`tel:${telephone}`}>{telephone}</a>
                        ) : (
                            'Non renseigné'
                        )}
                    </span>
                </div>
                <div className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <span>{adresse || 'Non renseigné'}</span>
                </div>
            </div>

            <div className={styles.maisonsSection}>
                <div className={styles.maisonsHeader}>
                    <h2><FaHome className={styles.icon} /> Maisons ({maisons?.length || 0})</h2>
                    <div className={styles.viewToggle}>
                        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? styles.active : ''}>
                            <FaList /> Liste
                        </button>
                        <button onClick={() => setViewMode('map')} className={viewMode === 'map' ? styles.active : ''}>
                            <FaMap /> Carte
                        </button>
                    </div>
                </div>

                {maisons && maisons.length > 0 ? (
                    viewMode === 'list' ? (
                        <div className={styles.maisonsList}>
                            {maisons.map(maison => (
                                <MaisonCard
                                    key={maison.id}
                                    maison={{ ...maison, proprietaire: proprietaire }}
                                />
                            ))}
                        </div>
                    ) : (
                        <MaisonListMap
                            maisons={maisons.map(maison => ({ ...maison, proprietaire: proprietaire }))}
                        />
                    )
                ) : (
                    <p className={styles.noMaisonsMessage}>Ce propriétaire n'a aucune maison enregistrée.</p>
                )}
            </div>
        </div>
    );
};

export default MaisonProprietaire;


