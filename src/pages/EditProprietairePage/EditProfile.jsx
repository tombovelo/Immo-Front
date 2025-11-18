import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditProprietaireForm from '../../components/organisms/EditProprietaireForm/EditProprietaireForm';
import { toast } from 'react-toastify';
import styles from './EditProfile.module.scss';
import { getProfile } from '../../services/ProprietaireService';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const EditeProprietairePage = () => {

    const navigate = useNavigate();
    const [proprietaire, setProprietaire] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProprietaire = async () => {
            try {
                const data = await getProfile();
                setProprietaire(data);
            } catch (error) {
                toast.error("Impossible de charger les données du propriétaire.");
                console.error(error);
                navigate('/admin/proprietaires'); // Rediriger si le propriétaire n'est pas trouvé
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
            {proprietaire ? <EditProprietaireForm proprietaireToEdit={proprietaire}  /> : <div>Propriétaire non trouvé.</div>}
        </div>
    );
};

export default EditeProprietairePage;

