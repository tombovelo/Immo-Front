import React from 'react';
import styles from './IconButton.module.scss';

const IconButton = ({ icon: Icon, onClick, label, className, ...props }) => {
  return (
    <button className={`${styles.iconButton} ${className || ''}`} onClick={onClick} aria-label={label} title={label} {...props}>
      <Icon />
    </button>
  );
};

export default IconButton;

