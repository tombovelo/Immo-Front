import React from 'react';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
