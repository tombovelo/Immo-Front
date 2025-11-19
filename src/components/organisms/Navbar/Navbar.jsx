import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/userAuth";
import styles from "./Navbar.module.scss";
import { useRole } from '../../../context/RoleContext';
import { FaSignInAlt, FaUserPlus, FaSearch, FaSignOutAlt, FaUserCircle, FaHome } from 'react-icons/fa';
import MyNavLink from "../../atoms/NavLink/MyNavLink";

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const { user, logout } = useAuth();
  const role = useRole();

  const handleShowLinks = () => {
    setShowLinks(!showLinks);
  };

  // Ferme le menu mobile après un clic sur un lien
  const closeMobileMenu = () => setShowLinks(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className={`${styles.navbar} ${showLinks ? styles.showNavbar : ""}`}>
      <div className={styles.navbarLogo}>
        {role === 'proprietaire' && user?.urlProfile ? (
          <Link to="/proprietaire/profile" className={styles.proprietaireInfo} onClick={closeMobileMenu}>
            <img src={user.urlProfile} alt={user.nom} className={styles.profileImage} />
            <span className={styles.proprietaireName}>{user.nom}</span>
          </Link>
        ) : (
          <Link to="/" className={styles.brandLink} onClick={closeMobileMenu}>
            ImmoProject
          </Link>
        )}
      </div>

      {/* Conteneur pour les liens et l'authentification */}
      <div className={styles.navbarMenuWrapper}>
        {/* Liens de navigation */}
        <ul className={styles.navbarLinks}>
          {role === 'proprietaire' && (
            <>
              <li className={styles.navbarItem}>
                <MyNavLink
                  to="/proprietaire/maisons/table"
                  icon={FaHome}
                  variant="link"
                  onClick={closeMobileMenu}
                >
                  Maisons
                </MyNavLink>
              </li>
              <li className={styles.navbarItem}>
                <MyNavLink
                  to="/proprietaire/profile"
                  icon={FaUserCircle}
                  variant="link"
                  onClick={closeMobileMenu}
                >
                  Profil
                </MyNavLink>
              </li>
              <li className={styles.navbarItem}>
                <MyNavLink
                  to="#"
                  icon={FaSignOutAlt}
                  variant="logoutButton"
                  onClick={handleLogout}
                >
                  Déconnexion
                </MyNavLink>
              </li>
            </>
          )}
        </ul>

        {/* Authentification */}
        <div className={styles.navbarAuth}>
          {role === 'user' && (
            <>
              <MyNavLink to="/register" icon={FaUserPlus} variant="primaryButton" onClick={closeMobileMenu}>
                S'inscrire
              </MyNavLink>
              <MyNavLink to="/maisons/list" icon={FaSearch} variant="primaryButton" onClick={closeMobileMenu}>
                Rech.
              </MyNavLink>
              <MyNavLink to="/login" icon={FaSignInAlt} variant="primaryButton" onClick={closeMobileMenu}>
                Connecter
              </MyNavLink>
            </>
          )}
        </div>
      </div>

      {/* Bouton Burger pour mobile */}
      <button onClick={handleShowLinks} className={styles.navbarBurger} aria-label="Toggle navigation">
        <span className={styles.burgerBar}></span>
        <span className={styles.burgerBar}></span>
        <span className={styles.burgerBar}></span>
      </button>
    </nav>
  );
};

export default Navbar;
