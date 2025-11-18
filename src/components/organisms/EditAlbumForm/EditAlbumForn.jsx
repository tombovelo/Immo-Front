import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../molecules/InputField/InputField";
import Button from "../../atoms/Button/Button";;
import styles from "./EditAlbumForm.module.scss";
import { toast } from "react-toastify";
import { updateAlbumAPI } from "../../../services/AlbumService";
import { albumSchema } from "../../../validation/AlbumValidation";

export default function EditAlbumForm({ albumToEdit, variant = 'standalone' }) {

    const navigate = useNavigate();
    const maison = albumToEdit?.maison;

    const [formData, setFormData] = useState(() => ({
        nomAlbum: albumToEdit?.nomAlbum || "",
        maisonId: maison?.id || "",
    }));

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await albumSchema.validate(formData, { abortEarly: false });
            setFormErrors({});

            const dataToSend = {
                nomAlbum: formData.nomAlbum,
                maisonId: formData.maisonId,
            };

            await updateAlbumAPI(albumToEdit.id, dataToSend);

            toast.success("✅ Album mis à jour avec succès !");

            // Redirection vers la page de détails de la maison associée
            if (maison?.id) {
                navigate(`/proprietaire/maisons/${maison.id}`);
            } else {
                // Redirection de secours si l'ID de la maison n'est pas trouvé
                navigate('/proprietaire/albums/table');
            }

        } catch (err) {
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach(e => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            } else {
                toast.error(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour.");
                console.error(err);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={`${styles.form} ${variant === 'standalone' ? styles.standalone : ''}`} onSubmit={handleSubmit}>

                {maison && (
                    <div className={styles.houseInfo}>
                        <h3 className={styles.houseInfoTitle}>Modifier Album</h3>
                        <div className={styles.houseDetails}>
                            <img
                                src={maison.cloudinaryUrl || 'https://via.placeholder.com/150'}
                                alt={`Photo de ${maison.adresse}`}
                                className={styles.houseImage}
                            />
                            <p className={styles.houseAddress}>
                                {maison.adresse}, {maison.ville} {maison.codePostal}
                            </p>
                        </div>
                    </div>
                )}

                <InputField
                    label="Nom de l'album *"
                    name="nomAlbum"
                    type="text"
                    value={formData.nomAlbum}
                    onChange={handleChange}
                    error={formErrors.nomAlbum}
                    disabled={isSubmitting}
                />

                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                </Button>
            </form>
        </div>
    );
}
