// c:\Users\sacha\Desktop\DevoirITU\ImmoProject\user-front\src\components\organisms\AddAlbumModal\AddAlbumModal.jsx
import React from 'react';
import Modal from 'react-modal';
import AlbumForm from '../AlbumForm/AlbumForm'; // Assurez-vous que le chemin est correct
import styles from './AddAlbumModal.module.scss'; // Nous allons créer ce fichier SCSS
import { FaTimes } from 'react-icons/fa';

// Définit l'élément racine de votre application pour l'accessibilité
Modal.setAppElement('#root'); // Assurez-vous que votre élément racine HTML a l'id="root"

const AddAlbumModal = ({ isOpen, onRequestClose, maisonId, onAlbumCreated }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Ajouter un nouvel album"
        >
            <div className={styles.header}>
                <h2>Ajouter album</h2>
                <button onClick={onRequestClose} className={styles.closeButton}>
                    <FaTimes />
                </button>
            </div>
            <AlbumForm
                maisonId={maisonId} // Passe l'ID de la maison au formulaire
                onAlbumCreated={onAlbumCreated} // Passe le callback pour fermer la modale après création
                variant="embedded" // Indique au formulaire d'utiliser le style sans conteneur
            />
        </Modal>
    );
};

export default AddAlbumModal;
