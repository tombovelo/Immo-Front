import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditMaisonForm from '../../components/organisms/EditMaisonForm/EditMaisonForm';
import { getHouseByIdAPI } from '../../services/MaisonService';
import { toast } from 'react-toastify';
import { handleError } from '../../helpers/ErrorHandler';
import styles from './EditMaisonPage.module.scss';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const EditMaisonPage = () => {
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
                handleError(error);
                navigate('/admin/maisons'); // Rediriger si la maison n'est pas trouvée
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
            {maison ? <EditMaisonForm maisonToEdit={maison} /> : <div>Maison non trouvée.</div>}
        </div>
    );
};

export default EditMaisonPage;
