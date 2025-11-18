import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MyNavLink.module.scss';

const MyNavLink = ({ to, icon: Icon, children, variant = 'link', onClick, className }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      // On combine dynamiquement la classe de base, la variante, et l'état "actif".
      className={({ isActive }) =>
        [
          styles.navLink, // Classe de base pour la structure
          styles[variant], // Classe pour la variante de style
          isActive && styles.active, // Classe pour le lien actif
          className, // Classes externes si besoin
        ].filter(Boolean).join(' ')
      }
    >
      {Icon && <Icon className={styles.icon} />}
      <span className={styles.text}>{children}</span>
    </NavLink>
  );
};

export default MyNavLink;

