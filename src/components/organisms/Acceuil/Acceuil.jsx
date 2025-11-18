import React from 'react';
import styles from './Acceuil.module.scss';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Accueil = () => {
    return (
        <div className={styles.accueilContainer}>
            <section className={styles.heroSection}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1>Trouvez la maison de vos rêves</h1>
                    <p>Ce site sert à aider les gens à trouver des maisons près de chez eux et à permettre aux gens de publier leur maison à louer ou à vendre gratuitement.</p>
                    <div className={styles.actionButtons}>
                        {/* <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>S'inscrire</Link> */}
                        <Link to="/login" className={`${styles.btn} ${styles.btnPrimary}`}>Se connecter</Link>
                        <Link to="/maisons/list" className={`${styles.btn} ${styles.btnSecondary}`}>
                            Voir nos contenus <FaArrowRight className={styles.arrowIcon} />
                        </Link>
                    </div>
                    <p className={styles.loginPrompt}>
                        Vous n'avez pas encore de compte ? <Link to="/register" className={styles.loginLink}>S'inscrire</Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Accueil;
