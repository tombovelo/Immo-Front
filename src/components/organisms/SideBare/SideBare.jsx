import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SideBare.module.scss';
import MyNavLink from '../../atoms/NavLink/NavLink';

import {
  FaTachometerAlt,
  FaHome,
  FaUserFriends,
  FaImages,
  FaImage,
  FaExchangeAlt,
  FaSignOutAlt,
  FaTools,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';

import { useAuth } from '../../../context/userAuth';

const navItems = [
  { to: '/admin/dashboard', icon: FaTachometerAlt, text: 'Dashboard' },
  { to: '/admin/maisons/table', icon: FaHome, text: 'Maisons' },
  { to: '/admin/proprietaires', icon: FaUserFriends, text: 'Propriétaires' },
  { to: '/admin/albums', icon: FaImages, text: 'Albums' },
  { to: '/admin/photos', icon: FaImage, text: 'Photos' },
  { to: '/admin/transactions', icon: FaExchangeAlt, text: 'Transaction' },
  { to: '/admin/register', icon: FaUserPlus, text: 'Enregistrer' },
  { to: '/admin/configuration', icon: FaTools, text: 'Configuration' },
  { to: '/admin/maisons/list', icon: FaTools, text: 'Liste Maison' },
];

const Sidebar = () => {
  const { logout, user} = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <Link to="/admin/dashboard" className={styles.brand}>
          {user && user.urlProfile && (
            <img
              src={user.urlProfile}
              alt="Profil"
              className={styles.brandImage}
            />
          )}
          <h2>{user && user.nom ? user.nom : 'ImmoAdmin'}</h2>
        </Link>
        <nav className={styles.navigation}>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <MyNavLink to={item.to} icon={item.icon}>{item.text}</MyNavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.sidebarBottom}>
        <button onClick={logout} className={styles.logoutButton}>
          <FaSignOutAlt className={styles.logoutIcon} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;



