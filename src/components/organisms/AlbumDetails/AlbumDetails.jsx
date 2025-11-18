import React, { useState } from 'react';
import styles from './AlbumDetails.module.scss';
import { FaPencilAlt, FaImages, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import IconText from '../../atoms/IconText/IconText';
import { useRole } from '../../../context/RoleContext';

// Import de la bibliothèque Lightbox et de ses styles
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const AlbumDetails = ({ album }) => {

    const role = useRole();
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    if (!album) {
        return <div className={styles.notFound}>Album non trouvé.</div>;
    }

    const { id, nomAlbum, description, dateCreation, photos, maison } = album;

    const formattedDate = dateCreation ? new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(dateCreation)) : 'Date non disponible';

    // Prépare les données pour la galerie Lightbox
    const slides = photos?.map(photo => ({
        src: photo.cloudinaryUrl,
        title: photo.description,
    })) || [];

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <div className={styles.detailsContainer}>
            <header className={styles.header}>
                {maison && (
                    <Link to={`/maisons/${maison.id}`} className={styles.maisonLink}>
                        <IconText icon={<FaArrowLeft />}>
                            Retour à la maison
                        </IconText>
                    </Link>
                )}
                {role === 'proprietaire' && (
                    <div className={styles.headerActions}>
                        <Link to={`/proprietaire/albums/edit/${id}`} className={styles.editButton}>
                            <FaPencilAlt /> Modifier
                        </Link>
                    </div>
                )}
            </header>

            <main className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    {maison?.cloudinaryUrl && (
                        <img src={maison.cloudinaryUrl} alt={`Maison à ${maison.adresse}`} className={styles.maisonImage} />
                    )}
                    <h1 className={styles.albumName}>{nomAlbum}</h1>

                    <div className={styles.meta}>
                        <IconText icon={<FaCalendarAlt />}>
                            {formattedDate}
                        </IconText>
                        <IconText icon={<FaImages />}>
                            {photos?.length || 0} photo(s)
                        </IconText>
                    </div>

                    {description && (
                        <div className={styles.descriptionSection}>
                            <h3>Description</h3>
                            <p>{description}</p>
                        </div>
                    )}
                </aside>

                <section className={styles.photosSection}>
                    {photos && photos.length > 0 ? (
                        <div className={styles.photosGrid}>
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className={styles.photoCard}
                                    onClick={() => openLightbox(index)}
                                >
                                    <img
                                        src={photo.cloudinaryUrl || 'https://via.placeholder.com/300x200'}
                                        alt={photo.nomFichier}
                                        className={styles.photoImage}
                                    />
                                    {photo.description && (
                                        <div className={styles.photoInfo}>
                                            <p className={styles.photoDescription}>{photo.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noPhotos}>
                            <FaImages className={styles.noPhotosIcon} />
                            <p>Cet album ne contient aucune photo pour le moment.</p>
                        </div>
                    )}
                </section>
            </main>
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                slides={slides}
                index={currentImageIndex}
                plugins={[Zoom]} // Active le plugin de zoom
                zoom={{
                    maxZoomPixelRatio: 3, // Permet de zoomer jusqu'à 3x, même sur les petites images
                    scrollToZoom: true    // Active le zoom avec la molette de la souris
                }}
            />
        </div>
    );
};

export default AlbumDetails;
