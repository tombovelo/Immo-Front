import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaLinkedin} from 'react-icons/fa';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Section "À Propos" */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>ImmoProject</h4>
          <p>Votre partenaire de confiance pour trouver la maison de vos rêves. Explorez nos listes et découvrez des propriétés exclusives.</p>
        </div>

        {/* Section "Liens Rapides" (Molécule) */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Liens Rapides</h4>
          <ul className={styles.linkList}>
            <li><Link to="/" className={styles.footerLink}>Accueil</Link></li>
            <li><Link to="/register" className={styles.footerLink}>S'inscrire</Link></li>
            {/* Ajoutez d'autres liens pertinents ici */}
            <li><a href="/maisons/list" className={styles.footerLink}>Recherche</a></li>
          </ul>
        </div>

        {/* Section "Contact" (Molécule) */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Contactez-nous</h4>
          <p>Email: <a href="mailto:agnontsoa@gmail.com" className={styles.footerLink}>agnontsoa@gmail.com</a></p>
          <p>Téléphone: +261344507778</p>
        </div>

        {/* Section "Réseaux Sociaux" (Molécule) */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Suivez-nous</h4>
          <div className={styles.socialIcons}>
            <a href="https://github.com/tombovelo" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/agnontsoa-hourray-tombovelo-b58118237?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <FaLinkedin />
            </a>
            <a href="https://web.facebook.com/beewolf.agnontsoa" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} ImmoProject. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;

