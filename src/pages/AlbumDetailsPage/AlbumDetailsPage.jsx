import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAlbumByIdAPI } from '../../services/AlbumService'; 
import AlbumDetails from '../../components/organisms/AlbumDetails/AlbumDetails';
import styles from './AlbumDetailsPage.module.scss';
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const AlbumDetailsPage = () => {
    
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
                toast.error("Impossible de charger les données de l'album.");
                console.error(error);
                navigate('/admin/albums'); 
            } finally {
                setLoading(false);
            }
        };
        fetchAlbum();
    }, [id, navigate]);

    if (loading) {
        return <LoadingSpinner message="Chargement des données de l'album..." />;
    }

    return (
        <div className={styles.container}>
            {album ? <AlbumDetails album={album} /> : <div>Album non trouvé.</div>}
        </div>
    );
};

export default AlbumDetailsPage;

