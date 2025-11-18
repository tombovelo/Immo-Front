import React from "react";
import styles from "./MaisonPopupContent.module.scss";
import { FaDoorOpen, FaMoneyBillWave, FaUser, FaPhone } from "react-icons/fa";
import IconText from "../../atoms/IconText/IconText"; // Assurez-vous que ce chemin est correct

const MaisonPopupContent = ({ maison }) => {
    const firstImage = maison?.cloudinaryUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500";

    const formattedPrice = new Intl.NumberFormat('mg-MG', {
        style: 'currency',
        currency: 'MGA',
    }).format(maison.prix);

    return (
        <div className={styles.popupContent}>
            {firstImage && <img src={firstImage} alt={maison.adresse} className={styles.popupImage} />}

            <div className={styles.villeTransaction}>
                <p className={styles.ville}>{maison.ville}</p>
                <p className={styles.typeTransaction}>{maison.typeTransaction.nom}</p>
            </div>

            <div className={styles.details}>
                <div className={styles.meta}>
                    <IconText icon={<FaDoorOpen />} textWeight="600" >{maison.nombrePieces} pièces</IconText>
                    <IconText icon={<FaMoneyBillWave />} textWeight="600" >{formattedPrice}</IconText>
                </div>
                {maison.proprietaire && (
                    <div className={styles.meta}>
                        <IconText icon={<FaUser />} textWeight="600">
                            {maison.proprietaire.nom}
                        </IconText>
                        {maison.proprietaire.telephone && (
                            <IconText icon={<FaPhone />} textWeight="600">
                                {maison.proprietaire.telephone}
                            </IconText>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaisonPopupContent;
