import React, { useState, useEffect } from 'react';
import styles from './AlbumItem.module.scss';
import { FaCalendarAlt, FaEdit, FaEye, FaPhotoVideo, FaTrashAlt } from 'react-icons/fa';
import IconText from '../../atoms/IconText/IconText';
import IconButton from '../../atoms/IconButton/IconButton';
import { useRole } from '../../../context/RoleContext';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { deleteAlbumAPI } from '../../../services/AlbumService';
import { handleError } from '../../../helpers/ErrorHandler';


export default function AlbumItem({ album, index = 0, onView }) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(null);
    const [isSliding, setIsSliding] = useState(false);
    const hasPhotos = album?.photos && album.photos.length > 0;
    const role = useRole();
    const navigate = useNavigate(); // 1. Initialiser useNavigate

    // Effet pour le minuteur du diaporama
    useEffect(() => {
        let intervalId;
        let timeoutId;

        if (hasPhotos && album.photos.length > 1) {
            const randomDelay = Math.random() * 3000;
            timeoutId = setTimeout(() => {
                intervalId = setInterval(() => {
                    setCurrentIndex(current => {
                        setPreviousIndex(current);
                        setIsSliding(true);
                        return (current + 1) % album.photos.length;
                    });
                }, 4000);
            }, randomDelay);

            return () => {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
            };
        }
    }, [hasPhotos, album?.photos?.length]);

    // Effet pour nettoyer l'état après l'animation
    useEffect(() => {
        if (isSliding) {
            const timer = setTimeout(() => {
                setIsSliding(false);
                setPreviousIndex(null);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isSliding]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const defaultCover = '/cover-album.jpeg';

    const handleViewClick = (e) => {
        e.stopPropagation();
        if (role === 'proprietaire') {
            // Pour le propriétaire, on ouvre la modale via la prop onView
            onView(album);
        } else {
            // Pour les autres utilisateurs, on redirige vers la page de détails de l'album
            navigate(`/albums/details/${album.id}`);
        }
    };

    // 2. Créer un gestionnaire pour le clic sur "Modifier"
    const handleEditClick = (e) => {
        e.stopPropagation(); // Empêche d'autres événements de se déclencher
        // Redirige vers la page d'édition avec l'ID de l'album
        navigate(`/proprietaire/albums/edit/${album.id}`);
    };

    const handleDeleteClick = async (e) => {
        e.stopPropagation();

        // 1. Demander une confirmation pour éviter les suppressions accidentelles
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'album "${album.nomAlbum}" ? Cette action est irréversible.`)) {
            try {
                // 2. Appeler l'API pour supprimer l'album
                await deleteAlbumAPI(album.id);
                toast.success("🗑️ Album supprimé avec succès !");

                // 3. Rediriger vers la page de la maison associée
                if (album.maison?.id) {
                    navigate(`/proprietaire/maisons/${album.maison.id}`);
                } else {
                    // Solution de secours : recharger la page pour refléter la suppression
                    window.location.reload();
                }
            } catch (error) {
                handleError(error); // Utiliser un gestionnaire d'erreurs centralisé
            }
        }
    };

    return (
        <article
            className={styles.card}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={styles.imageContainer}>
                {hasPhotos ? (
                    <>
                        {previousIndex !== null && (
                            <img
                                key={previousIndex}
                                src={album.photos[previousIndex].cloudinaryUrl}
                                alt=""
                                className={styles.slideOut}
                            />
                        )}
                        <img
                            key={currentIndex}
                            src={album.photos[currentIndex].cloudinaryUrl}
                            alt={album.photos[currentIndex]?.description || `Photo de l'album ${album.nomAlbum}`}
                            className={isSliding ? styles.slideIn : ''}
                        />
                    </>
                ) : (
                    <img src={defaultCover} alt={`Couverture de l'album ${album.nomAlbum}`} />
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title} title={album.nomAlbum}>{album.nomAlbum}</h3>
                    {role === 'proprietaire' ? (
                        <div className={styles.actionButtons}>
                            <IconButton icon={FaEye} label="Voir" onClick={handleViewClick} />
                            {/* 3. Ajouter l'événement onClick au bouton Modifier */}
                            <IconButton icon={FaEdit} label="Modifier" onClick={handleEditClick} />
                            <IconButton className={styles.deleteButton} icon={FaTrashAlt} label="Supprimer" onClick={handleDeleteClick} />
                        </div>
                    ) : (
                        <div className={styles.actionButtons}>
                            <IconButton icon={FaEye} label="Voir" onClick={handleViewClick} />
                        </div>
                    )}
                </div>
                <div className={styles.meta}>
                    <IconText icon={<FaPhotoVideo />}>
                        {album.photos?.length || 0} photo(s)
                    </IconText>
                    <IconText icon={<FaCalendarAlt />}>
                        {formatDate(album.dateCreation)}
                    </IconText>
                </div>
            </div>
        </article>
    );
}
