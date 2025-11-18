import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleError } from '../../helpers/ErrorHandler';
import styles from './EditAlbumPage.module.scss';
import { getAlbumByIdAPI } from '../../services/AlbumService';
import EditAlbumForm from '../../components/organisms/EditAlbumForm/EditAlbumForn';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const EditAlbumPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!id) return;
            try {
                const data = await getAlbumByIdAPI(id);
                setAlbum(data);
            } catch (error) {
                toast.error("Impossible de charger les données de la photo.");
                handleError(error);
                navigate('/admin/albums'); // Rediriger si la maison n'est pas trouvée
            } finally {
                setLoading(false);
            }
        };
        fetchAlbum();
    }, [id, navigate]);

    if (loading) {
        return <LoadingSpinner message="Chargement des données de l'album..."/>;
    }

    // Le formulaire est rendu uniquement si les données de la maison sont chargées
    return (
        <div className={styles.container}>
            {album ? <EditAlbumForm albumToEdit={album} /> : <div>Album non trouvée.</div>}
        </div>
    );
};

export default EditAlbumPage;