import React, { useState, useEffect } from 'react';
import styles from './MaisonDetails.module.scss';
import { FaDoorOpen, FaUser, FaPencilAlt, FaImages, FaPhone, FaEnvelope, FaPlusCircle, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import IconText from '../../atoms/IconText/IconText';
import AddAlbumModal from '../AddAlbumModal/AddAlbumModal';
import AlbumItem from '../../molecules/AlbumItem/AlbumItem';
import AlbumGalleryModal from '../AlbumGalleryModal/AlbumGalleryModal';
import { useRole } from '../../../context/RoleContext';

const MaisonDetails = ({ maison: maisonProp }) => {
    // --- Hooks et États ---
    const [maison, setMaison] = useState(maisonProp);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const role = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        setMaison(maisonProp);
    }, [maisonProp]);

    // --- Gestionnaires d'événements ---
    const handleAlbumAdded = (newAlbum) => {
        setMaison(current => ({ ...current, albums: [...(current.albums || []), newAlbum] }));
    };

    const handlePhotoAddedToAlbum = (newPhoto) => {
        setMaison(currentMaison => {
            const updatedAlbums = currentMaison.albums.map(album =>
                album.id === newPhoto.albumId ? { ...album, photos: [...(album.photos || []), newPhoto] } : album
            );
            return { ...currentMaison, albums: updatedAlbums };
        });
        setSelectedAlbum(current =>
            current && current.id === newPhoto.albumId ? { ...current, photos: [...(current.photos || []), newPhoto] } : current
        );
    };

    const openGallery = (album) => {
        setSelectedAlbum(album);
        setIsGalleryOpen(true);
    };

    // --- Rendu ---
    if (!maison) return <div>Maison non trouvée.</div>;

    const { id, adresse, ville, prix, nombrePieces, cloudinaryUrl, proprietaire, typeTransaction, albums } = maison;
    const formattedPrix = new Intl.NumberFormat("mg-MG", { style: "currency", currency: "MGA" }).format(prix);

    return (
        <div className={styles.pageWrapper}>
            {/* === EN-TÊTE DE LA PAGE === */}
            <header className={styles.pageHeader}>
                <h1>{adresse}, {ville}</h1>
                {role === 'proprietaire' && (
                    <button className={styles.actionButton} onClick={() => navigate(`/proprietaire/maisons/edit/${id}`)}>
                        <FaPencilAlt /> Modifier
                    </button>
                )}
            </header>

            {/* === CONTENU PRINCIPAL (IMAGE + INFOS CLÉS) === */}
            <div className={styles.mainGrid}>
                <div className={styles.imageGallery}>
                <img src={cloudinaryUrl || 'https://via.placeholder.com/800x500'} alt={`Maison à ${adresse}`} className={styles.mainImage} loading="lazy" />
                    <div className={styles.transactionBadge}><FaTag /> {typeTransaction?.nom}</div>
                </div>

                <div className={styles.summaryCard}>
                    <p className={styles.price}>{formattedPrix}</p>
                    <div className={styles.statsGrid}>
                        <IconText icon={<FaDoorOpen />}>{nombrePieces} pièces</IconText>
                        {/* Ajoutez d'autres statistiques clés ici (ex: surface) */}
                    </div>
                    {maison.description && (
                        <div className={styles.description}>
                            <h3>Description</h3>
                            <p className={isDescriptionExpanded ? styles.expanded : ''}>
                               {maison.description}
                            </p>
                            <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className={styles.expandButton}>
                                {isDescriptionExpanded ? 'Lire moins' : 'Lire la suite'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* === CARTE DU PROPRIÉTAIRE === */}
            {proprietaire && (
                <div className={styles.ownerCard}>
                    <IconText
                        icon={<FaUser />}
                        textWeight='700'
                        fontSize='1rem'
                        iconSize='1rem'
                        className={styles.ownerHeader}
                    >
                        Informations du Propriétaire
                    </IconText>
                    <div className={styles.ownerDetails}>
                        <p><strong>Nom :</strong> {proprietaire.prenom} {proprietaire.nom}</p>
                        <p><strong>Téléphone :</strong> <a href={`tel:${proprietaire.telephone}`}>{proprietaire.telephone}</a></p>
                        <p><strong>Email :</strong> <a href={`mailto:${proprietaire.utilisateur?.email}`}>{proprietaire.utilisateur?.email || 'Non renseigné'}</a></p>
                    </div>
                </div>
            )}

            {/* === SECTION DES ALBUMS === */}
            <section className={styles.albumsSection}>
                <div className={styles.albumsHeader}>
                    <h2><FaImages /> Albums Photos ({albums?.length || 0})</h2>
                    {role === 'proprietaire' && (
                        <button className={styles.actionButton} onClick={() => setIsAddAlbumModalOpen(true)}>
                            <FaPlusCircle /> Ajouter un album
                        </button>
                    )}
                </div>
                {albums && albums.length > 0 ? (
                    <div className={styles.albumsList}>
                        {albums.map((album, index) => <AlbumItem key={album.id} album={album} index={index} onView={openGallery} />)}
                    </div>
                ) : (
                    <p className={styles.noAlbums}>Cette maison n'a aucun album pour le moment.</p>
                )}
            </section>

            {/* === MODALES === */}
            <AlbumGalleryModal isOpen={isGalleryOpen} onRequestClose={() => setIsGalleryOpen(false)} album={selectedAlbum} onPhotoAdded={handlePhotoAddedToAlbum} />
            <AddAlbumModal isOpen={isAddAlbumModalOpen} onRequestClose={() => setIsAddAlbumModalOpen(false)} maisonId={id} onAlbumCreated={handleAlbumAdded} />
        </div>
    );
};

export default MaisonDetails;
