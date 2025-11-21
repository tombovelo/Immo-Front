import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MyNavLink.module.scss';

const MyNavLink = ({
  to,
  icon: Icon,
  children,
  variant = 'link',
  onClick,
  className,
  iconColor,
  textColor = '#212529',
  iconSize = '1.125rem',
  textSize,
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          styles.navLink, // Classe de base pour la structure
          styles[variant], // Classe pour la variante de style
          isActive && styles.active, // Classe pour le lien actif
          className, // Classes externes si besoin
        ].filter(Boolean).join(' ')
      }
    >
      {Icon && <Icon className={styles.icon} style={{ color: iconColor, fontSize: iconSize }} />}
      <span className={styles.text} style={{ color: textColor, fontSize: textSize }}>{children}</span>
    </NavLink>
  );
};

export default MyNavLink;
