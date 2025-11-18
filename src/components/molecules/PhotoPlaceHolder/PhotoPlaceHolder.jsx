import React from 'react';
import styles from './PhotoPlaceholder.module.scss';
import { FaImage } from 'react-icons/fa';

const PhotoPlaceholder = () => {
    return (
        <div className={styles.placeholder}>
            <div className={styles.spinner}></div>
            <FaImage className={styles.icon} />
            <p className={styles.text}>Traitement en cours...</p>
        </div>
    );
};

export default PhotoPlaceholder;

