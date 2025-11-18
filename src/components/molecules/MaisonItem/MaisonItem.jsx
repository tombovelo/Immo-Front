import { FaMapMarkerAlt, FaDoorOpen, FaImages, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from './MaisonItem.module.scss';
import IconText from "../../atoms/IconText/IconText";
import Button from "../../atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../context/RoleContext";

export default function MaisonItem({ maison }) {
  const navigate = useNavigate();
  const role = useRole();

  const prix = maison.prix != null
    ? new Intl.NumberFormat("mg-MG", {
        style: "currency",
        currency: "MGA",
      }).format(maison.prix)
    : "Prix non spécifié";

  const photoUrl = maison?.cloudinaryUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop";

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/admin/maisons/${maison.id}`);
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <p className={styles.ville}>{maison.ville}</p>
        <p className={styles.transactionBadge}>{maison.typeTransaction.nom}</p>
      </div>

      <div className={styles.imageContainer}>
        <img src={photoUrl} alt={`Maison à ${maison.adresse}`} loading="lazy" />
        <div className={styles.addressOverlay}>
          <IconText icon={<FaMapMarkerAlt />} color="white" iconColor="white">
            {maison.adresse || "Adresse non spécifiée"}
          </IconText>
        </div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.price}>{prix}</p>
        <div className={styles.statsGrid}>
          <IconText icon={<FaDoorOpen />}>{`${maison.nombrePieces} pièces`}</IconText>
          <IconText icon={<FaImages />}>{`${maison.albums?.length || 0} albums`}</IconText>
        </div>
        <div className={`${styles.statusBadge} ${maison.visible ? styles.visible : styles.hidden}`}>
          {maison.visible ? <FaEye /> : <FaEyeSlash />}
          <span>{maison.visible ? 'Visible' : 'Masquée'}</span>
        </div>
      </div>

      {role === 'user' && (
        <div className={styles.cardFooter}>
          <Button onClick={handleDetailsClick}>
            détails
          </Button>
        </div>
      )}
    </article>
  );
}
