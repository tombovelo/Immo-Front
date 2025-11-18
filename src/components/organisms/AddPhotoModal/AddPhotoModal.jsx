import React from 'react';
import Modal from 'react-modal';
import PhotoForm from '../PhotoForm/PhotoForm';
import styles from './AddPhotoModal.module.scss';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

const AddPhotoModal = ({ isOpen, onRequestClose, albumId, onPhotoCreated }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel="Ajouter une nouvelle photo"
        >
            <div className={styles.header}>
                <h2>Ajouter une photo</h2>
                <button onClick={onRequestClose} className={styles.closeButton}>
                    <FaTimes />
                </button>
            </div>
            <PhotoForm
                albumId={albumId}
                onPhotoCreated={onPhotoCreated}
                variant="embedded" // Indique au formulaire d'utiliser le style sans conteneur
            />
        </Modal>
    );
};

export default AddPhotoModal;
