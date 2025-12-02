import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProprietaireByIdAPI } from '../../services/ProprietaireService';
import MaisonProprietaire from '../../components/organisms/MaisonProprietaire/MaisonProprietaire';
import styles from './MaisonProprietairePage.module.scss';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const MaisonProprietairePage = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const [proprietaire, setProprietaire] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProprietaire = async () => {
            if (!id) return;
            try {
                const data = await getProprietaireByIdAPI(id);
                setProprietaire(data);
            } catch (error) {
                toast.error("Impossible de charger les données du propriétaire.");
                console.error(error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProprietaire();
    }, [id, navigate]);

    if (loading) {
        return <LoadingSpinner message='Chargement des données du propriétaire...'/>;
    }

    return (
        <div className={styles.container}>
            {proprietaire ? <MaisonProprietaire proprietaire={proprietaire} /> : <div>Propriétaire non trouvé.</div>}
        </div>
    );
};

export default MaisonProprietairePage;

