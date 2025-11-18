import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getHouseByIdAPI } from '../../services/MaisonService';
import MaisonDetails from '../../components/organisms/MaisonDetails/MaisonDetails';
import styles from './MaisonDetailsPage.module.scss';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const MaisonDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [maison, setMaison] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaison = async () => {
            if (!id) return;
            try {
                const data = await getHouseByIdAPI(id);
                setMaison(data);
            } catch (error) {
                toast.error("Impossible de charger les données de la maison.");
                console.error(error);
                navigate('/proprietaires/maisons/table');
            } finally {
                setLoading(false);
            }
        };
        fetchMaison();
    }, [id, navigate]);

    if (loading) {
        return <LoadingSpinner message='Chargement des données de la maison...'/>;
    }

    return (
        <div className={styles.container}>
            {maison ? <MaisonDetails maison={maison} /> : <div>Maison non trouvée.</div>}
        </div>
    );
};

export default MaisonDetailsPage;

