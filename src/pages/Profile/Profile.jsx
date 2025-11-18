import { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile } from '../../services/ProprietaireService';
import ProprietaireDetails from '../../components/organisms/ProprietaireDetails/ProprietaireDetails';
import styles from './Profile.module.scss';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const Profile = () => {
    const navigate = useNavigate();
    const [proprietaire, setProprietaire] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProprietaire = async () => {
            try {
                const data = await getProfile();
                console.log(data);
                setProprietaire(data);
            } catch (error) {
                toast.error("Impossible de charger les données du propriétaire.");
                console.error(error);
                navigate('/proprietaire/profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProprietaire();
    }, [navigate]);

    if (loading) {
        return <LoadingSpinner message='Chargement des données du propriétaire...'/>;
    }

    return (
        <div className={styles.container}>
            {proprietaire ? <ProprietaireDetails proprietaire={proprietaire} /> : <div>Propriétaire non trouvé.</div>}
        </div>
    );
};

export default Profile;
