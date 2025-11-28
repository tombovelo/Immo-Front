import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MaisonCard from '../../molecules/MaisonCard/MaisonCard';
import styles from './Actualite.module.scss';
import { getHousesAPI } from '../../../services/MaisonService'; // Assurez-vous que le chemin est correct
import Button from '../../atoms/Button/Button';
import MyNavLink from '../../atoms/NavLink/MyNavLink';
import { FaSearch } from 'react-icons/fa';


const Actualite = () => {

    const [maisonsAlaUne, setMaisonsAlaUne] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaisons = async () => {
            try {
                setLoading(true);
                const data = await getHousesAPI();
                // Prendre les 4 premières maisons
                setMaisonsAlaUne(data.slice(1, 5));
            } catch (err) {
                console.error("Erreur lors de la récupération des maisons :", err);
                setError("Impossible de charger les maisons pour le moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchMaisons();
    }, []);

    // Données pour le carrousel d'actualités
    const newsData = [
        {
            image: "caroussel-1.png",
            text: "Votre future maison vous attend. Commencez votre recherche gratuitement et transformez votre rêve en réalité."
        },
        {
            image: "caroussel-2.png",
            text: "Simplifiez votre recherche. Nos outils intuitifs et gratuits vous connectent directement aux meilleures annonces du marché."
        },
        {
            image: "caroussel-3.png",
            text: "Vendez ou louez plus vite. Inscrivez votre bien gratuitement et touchez des milliers d'acheteurs et locataires potentiels dès aujourd'hui."
        }
    ];

    // Paramètres pour le carrousel
    const sliderSettings = {
        dots: true,
        infinite: true, // Fait tourner le carrousel en boucle
        speed: 1000, // Vitesse de la transition de glissement (en ms)
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000, // Temps d'attente entre chaque glissement (en ms)
        fade: false, // Important : false pour une animation de glissement (slide)
        cssEase: 'ease-in-out', // Une transition plus douce pour le glissement
        pauseOnHover: true,
    };

    return (
        <main className={styles.homePage}>
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Trouvez la maison de vos rêves</h1>
                    <p className={styles.heroSubtitle}>
                        Parcourez des milliers d'annonces pour trouver le bien immobilier qui vous correspond.
                    </p>
                    {/* <Button onClick={handleSearchClick} variant="primary" size="lg">
            Lancer la recherche
          </Button> */}
                    <MyNavLink to="/maisons/list" textColor="white" icon={FaSearch} variant="primaryButton" className={styles.navbarLink}>
                        Lancer la recherche
                    </MyNavLink>
                </div>
            </section>

            <div className={styles.contentWrapper}>
                <section className={styles.section}>
                    <h2 className={styles.title}>Dernières actualités</h2>
                    <div className={styles.carouselContainer}>
                        <Slider {...sliderSettings}>
                            {newsData.map((news, index) => (
                                <div key={index}>
                                    <div className={styles.carouselSlide}>
                                        <div className={styles.newsImageContainer}>
                                            <img src={news.image} alt={`Actualité ${index + 1}`} className={styles.newsImage} />
                                        </div>
                                        <div className={styles.newsContent}>
                                            <p>{news.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.title}>Nos maisons à la une</h2>
                    {loading && <p style={{ textAlign: 'center' }}>Chargement des maisons...</p>}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {!loading && !error && (
                        <div className={styles.maisonsGrid}>
                            {maisonsAlaUne.map((maison) => (
                                <MaisonCard key={maison.id} maison={maison} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Actualite;
