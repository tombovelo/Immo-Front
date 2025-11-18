import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import styles from './AlbumGalleryModal.module.scss';
import { FaEdit, FaTimes, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import IconButton from '../../atoms/IconButton/IconButton';
import IconText from '../../atoms/IconText/IconText';
import { useRole } from '../../../context/RoleContext';
import AddPhotoModal from '../AddPhotoModal/AddPhotoModal';
import { getPhotoByIdAPI, deletePhotoAPI } from '../../../services/PhotoService'; // Assurez-vous que ces fonctions existent
import PhotoPlaceholder from '../../molecules/PhotoPlaceHolder/PhotoPlaceHolder';
import { toast } from 'react-toastify';
import { handleError } from '../../../helpers/ErrorHandler';

// Définit l'élément racine de votre application pour l'accessibilité
Modal.setAppElement('#root');

const POLLING_INTERVAL = 5000; // Interroge le serveur toutes les 5 secondes

const AlbumGalleryModal = ({ isOpen, onRequestClose, album, onPhotoAdded }) => {


    const role = useRole();
    const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
    // On ajoute un état local pour gérer l'album affiché dans la modale.
    const [currentAlbum, setCurrentAlbum] = useState(album);
    const pollingIntervalRef = useRef(null);
    const [deletingPhotos, setDeletingPhotos] = useState([]); // État pour gérer l'animation de suppression

    // Ce `useEffect` synchronise l'état local si l'album passé en prop change.
    useEffect(() => {
        setCurrentAlbum(album);
    }, [album]);

    // Ce `useEffect` gère la logique de polling pour les photos en cours de traitement.
    useEffect(() => {
        const photosToPoll = currentAlbum?.photos?.filter(p => !p.cloudinaryUrl) || [];

        const stopPolling = () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };

        const startPolling = () => {
            stopPolling(); // S'assure qu'un seul intervalle tourne à la fois
            pollingIntervalRef.current = setInterval(async () => {
                // À chaque tick, on vérifie à nouveau quelles photos sont en attente
                const photosStillPending = currentAlbum?.photos?.filter(p => !p.cloudinaryUrl) || [];
                if (photosStillPending.length === 0) {
                    stopPolling();
                    return;
                }

                for (const pendingPhoto of photosStillPending) {
                    try {
                        const updatedPhoto = await getPhotoByIdAPI(pendingPhoto.id);
                        if (updatedPhoto && updatedPhoto.cloudinaryUrl) {
                            // La photo est prête, on met à jour l'état
                            setCurrentAlbum(prevAlbum => ({
                                ...prevAlbum,
                                photos: prevAlbum.photos.map(p =>
                                    p.id === updatedPhoto.id ? updatedPhoto : p
                                ),
                            }));
                        }
                    } catch (error) {
                        console.error(`Erreur lors du polling pour la photo ${pendingPhoto.id}:`, error);
                    }
                }
            }, POLLING_INTERVAL);
        };

        if (photosToPoll.length > 0) {
            startPolling();
        } else {
            stopPolling();
        }

        // Nettoyage : arrête le polling si le composant est démonté
        return () => stopPolling();
    }, [currentAlbum]); // Cet effet se relance à chaque modification des photos de l'album

    // On vérifie `currentAlbum` au lieu de `album`
    if (!currentAlbum) {
        return null;
    }

    const openAddPhotoModal = () => {
        setIsAddPhotoModalOpen(true);
    };

    const closeAddPhotoModal = () => {
        setIsAddPhotoModalOpen(false);
    };

    const handlePhotoCreated = (newPhoto) => {
         // 1. Mise à jour optimiste : ajoute la nouvelle photo (sans cloudinaryUrl) à l'état local
         setCurrentAlbum(prevAlbum => ({
            ...prevAlbum,
            photos: [...(prevAlbum.photos || []), newPhoto]
        }));

        // 2. Propager l'événement au composant parent, s'il écoute
        if (onPhotoAdded) {
            onPhotoAdded(newPhoto);
        }
    };

    const handleDeletePhoto = async (photo) => {
        // Demande de confirmation
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.`)) {
            // Ajoute l'ID de la photo à la liste des suppressions pour démarrer l'animation
            setDeletingPhotos(prev => [...prev, photo.id]);

            try {
                // Appel à l'API de suppression
                await deletePhotoAPI(photo.id);

                // Attendre la fin de l'animation (500ms) avant de mettre à jour l'état
                setTimeout(() => {
                    setCurrentAlbum(prevAlbum => ({
                        ...prevAlbum,
                        photos: prevAlbum.photos.filter(p => p.id !== photo.id)
                    }));
                    toast.success("🗑️ Photo supprimée avec succès !");
                }, 500);

            } catch (error) {
                handleError(error);
                // En cas d'erreur, on retire la photo de la liste de suppression pour arrêter l'animation
                setDeletingPhotos(prev => prev.filter(id => id !== photo.id));
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel={`Galerie de l'album ${currentAlbum.nomAlbum}`}
        >
            <div className={styles.header}>
            <div className={styles.headerLeft}>
                    <h2>{currentAlbum.nomAlbum}</h2>
                    {role === 'proprietaire' && (
                        <IconText
                            icon={<FaPlusCircle />}
                            onClick={openAddPhotoModal}
                            className={styles.Button}
                            iconColor='white'
                            color='white'
                        >
                            Ajouter
                        </IconText>
                    )}
                </div>
                <button onClick={onRequestClose} className={styles.closeButton}>
                    <FaTimes />
                </button>
            </div>
            <div className={styles.gallery}>
            {currentAlbum.photos && currentAlbum.photos.length > 0 ? (
                    currentAlbum.photos.map(photo => (
                        <div
                            key={photo.id}
                            className={`${styles.photoCard} ${deletingPhotos.includes(photo.id) ? styles.deleting : ''}`}
                        >
                            {photo.cloudinaryUrl ? (
                                <img src={photo.cloudinaryUrl} alt={photo.description || `Photo de l'album ${currentAlbum.nomAlbum}`} />
                            ) : (
                                <PhotoPlaceholder />
                            )}
                            {role === 'proprietaire' && (
                                <div className={styles.actionButtons}>
                                     {/* Désactive les boutons tant que la photo n'est pas prête */}
                                     <IconButton icon={FaEdit} className={styles.editButton} label="Modifier" disabled={!photo.cloudinaryUrl} />
                                     <IconButton className={styles.deleteButton} icon={FaTrashAlt} label="Supprimer" onClick={() => handleDeletePhoto(photo)} />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Cet album ne contient aucune photo.</p>
                )}
            </div>
            <AddPhotoModal
                isOpen={isAddPhotoModalOpen}
                onRequestClose={closeAddPhotoModal}
                albumId={currentAlbum.id}
                onPhotoCreated={handlePhotoCreated}
            />
        </Modal>
    );
};

export default AlbumGalleryModal;
