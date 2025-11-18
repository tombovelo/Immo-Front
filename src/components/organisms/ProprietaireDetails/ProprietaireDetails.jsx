import React from 'react';
import styles from './ProprietaireDetails.module.scss';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome, FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MaisonItem from '../../molecules/MaisonItem/MaisonItem';
import IconText from '../../atoms/IconText/IconText';
import { useNavigate } from 'react-router-dom';



const ProprietaireDetails = ({ proprietaire }) => {

    const navigate = useNavigate();
    
    
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
                <div className={styles.headerActions}>
                    {/* <Link to={`/admin/proprietaires/edit/${id}`} className={styles.editButton}>
                        <FaPencilAlt /> Modifier
                    </Link> */}
                    <IconText icon={<FaPencilAlt />} 
                            className={styles.Button} 
                            iconColor='white' color='white' 
                            onClick={() => navigate(`/proprietaire/profile/edit/${id}`)}
                        >
                            Modifier
                        </IconText>
                </div>
            </div>

            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <FaEnvelope className={styles.icon} />
                    <span>{utilisateur?.email || 'Non renseigné'}</span>
                </div>
                <div className={styles.infoItem}>
                    <FaPhone className={styles.icon} />
                    <span>{telephone || 'Non renseigné'}</span>
                </div>
                <div className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <span>{adresse || 'Non renseigné'}</span>
                </div>
            </div>

            <div className={styles.maisonsSection}>
                <h2><FaHome className={styles.icon} /> Maisons ({maisons?.length || 0})</h2>
                {maisons && maisons.length > 0 ? (
                    <div className={styles.maisonsList}>
                        {maisons.map(maison => (
                            <MaisonItem key={maison.id} maison={maison} />
                        ))}
                    </div>
                ) : (
                    <p>Ce propriétaire n'a aucune maison enregistrée.</p>
                )}
            </div>
        </div>
    );
};

export default ProprietaireDetails;
