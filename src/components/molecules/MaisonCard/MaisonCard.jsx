import { FaMapMarkerAlt, FaDoorOpen, FaMoneyBillWave, FaPhone, FaUser } from "react-icons/fa";
import styles from "./MaisonCard.module.scss";
import IconText from "../../atoms/IconText/IconText";
import Button from "../../atoms/Button/Button";
import { useNavigate } from "react-router-dom";

export default function MaisonCard({ maison }) {
  const navigate = useNavigate();

  const prix = maison.prix != null
    ? new Intl.NumberFormat("mg-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0, // Pour un affichage plus propre des prix ronds
    }).format(maison.prix)
    : "Prix non disponible";

  const photoUrl = maison?.cloudinaryUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop";


  const handleAddressClick = () => {
    // Navigue vers la page de la carte et passe l'objet maison dans l'état
    navigate('/maisons/map', { state: { maison } });
  };


  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.ville}>{maison.ville}</span>
        <span className={styles.transactionBadge}>{maison.typeTransaction.nom}</span>
      </div>

      <div className={styles.imageContainer}>
        <img src={photoUrl} alt={`Maison à ${maison.adresse}`} />
        <div className={styles.imageOverlay}>
          <IconText icon={<FaMapMarkerAlt />} color="white" iconColor="white" onClick={handleAddressClick}>
            {maison.adresse || "Adresse non spécifiée"}
          </IconText>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardStats}>
          <IconText icon={<FaDoorOpen />}>{`${maison.nombrePieces} pièces`}</IconText>
          <p className={styles.price}>{prix}</p>
        </div>
        <div className={styles.cardOwner}>
          <IconText icon={<FaUser />}>
            {maison.proprietaire.nom}
          </IconText>
          {maison.proprietaire.telephone && (
            <IconText icon={<FaPhone />}>
              {maison.proprietaire.telephone}
            </IconText>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <Button onClick={() => navigate(`/maisons/${maison.id}`)} fullWidth>
          Voir les détails
        </Button>
      </div>
    </article>
  );
}
