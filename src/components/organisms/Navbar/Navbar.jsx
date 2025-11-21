import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/userAuth";
import styles from "./Navbar.module.scss";
import { useRole } from '../../../context/RoleContext';
import { FaSignInAlt, FaUserPlus, FaSearch, FaSignOutAlt, FaUserCircle, FaHome } from 'react-icons/fa';
import MyNavLink from "../../atoms/NavLink/MyNavLink";

const Navbar = () => {
  const { user, logout } = useAuth();
  const role = useRole();

  const handleLogout = () => logout();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        {role === 'proprietaire' && user?.urlProfile ? (
          <Link to="/proprietaire/profile" className={styles.proprietaireInfo}>
            <img src={user.urlProfile} alt={user.nom} className={styles.profileImage} />
            <span className={styles.proprietaireName}>{user.nom}</span>
          </Link>
        ) : (
          <Link to="/" className={styles.brandLink}>
            ImmoProject
          </Link>
        )}
      </div>

      <div className={styles.navbarMenuWrapper}>
        <ul className={styles.navbarLinks}>
           {/* Cet espace pousse les icônes à droite */}
        </ul>

        <div className={styles.navbarAuth}>
          {role === 'proprietaire' && (
            <>
              <MyNavLink
                to="/proprietaire/maisons/table"
                icon={FaHome}
                variant="link"
                textColor="white"
                iconColor="white"
                className={styles.navbarLink}
              >
                Maisons
              </MyNavLink>
              <MyNavLink
                to="/proprietaire/profile"
                icon={FaUserCircle}
                variant="link"
                textColor="white"
                iconColor="white"
                className={styles.navbarLink}
              >
                Profil
              </MyNavLink>
              <MyNavLink
                to="#"
                icon={FaSignOutAlt}
                variant="logoutButton"
                onClick={handleLogout}
                textColor="orange"
              >
                Déconnexion
              </MyNavLink>
            </>
          )}
          {role === 'user' && (
            <>
              <MyNavLink to="/register" textColor="white" icon={FaUserPlus} variant="primaryButton" className={styles.navbarLink}>
                S'inscrire
              </MyNavLink>
              <MyNavLink to="/maisons/list" textColor="white" icon={FaSearch} variant="primaryButton" className={styles.navbarLink}>
                Rech.
              </MyNavLink>
              <MyNavLink to="/login" textColor="white" icon={FaSignInAlt} variant="primaryButton" className={styles.navbarLink}>
                Connecter
              </MyNavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
