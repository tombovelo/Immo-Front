import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPhotoForm from '../../components/organisms/EditPhotoForm/EditPhotoForm';
import { toast } from 'react-toastify';
import { handleError } from '../../helpers/ErrorHandler';
import styles from './EditPhotoPage.module.scss'
import { getPhotoByIdAPI } from '../../services/PhotoService';

const EditPhotoPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhoto = async () => {
            if (!id) return;
            try {
                const data = await getPhotoByIdAPI(id);
                setPhoto(data);
            } catch (error) {
                toast.error("Impossible de charger les données de la photo.");
                handleError(error);
                navigate('/admin/photos'); // Rediriger si la maison n'est pas trouvée
            } finally {
                setLoading(false);
            }
        };
        fetchPhoto();
    }, [id, navigate]);

    if (loading) {
        return <LoadingSpinner message='Chargement des données de la photo...'/>;
    }

    // Le formulaire est rendu uniquement si les données de la maison sont chargées
    return (
        <div className={styles.container}>
            {photo ? <EditPhotoForm photoToEdit={photo} /> : <div>Photo non trouvée.</div>}
        </div>
    );
};

export default EditPhotoPage;