import { useState, useEffect } from "react";
import styles from "./AlbumForm.module.scss";
import Button from "../../atoms/Button/Button";
import InputField from "../../molecules/InputField/InputField";
import TextareaField from "../../molecules/TextAreaField/TextAreaField";
import SelectField from "../../molecules/SelectField/SelectField";
import { getMyHouseAPI } from "../../../services/MaisonService";
import { createAlbumAPI } from "../../../services/AlbumService";
import { toast } from "react-toastify";
import { albumSchema } from "../../../validation/AlbumValidation";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../helpers/ErrorHandler";

// AlbumForm accepte maintenant maisonId comme prop, et un callback onAlbumCreated optionnel
export default function AlbumForm({ maisonId: propMaisonId, onAlbumCreated, variant = 'standalone' }) { // Ajout de la prop 'variant'

    const [formData, setFormData] = useState({
        nomAlbum: "",
        description: "",
        maisonId: propMaisonId || "", // Initialise avec propMaisonId si fourni
    });

    const [maisons, setMaisons] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // 📦 Charger les maisons depuis ton API
    useEffect(() => {
        // Seulement charger les maisons si propMaisonId n'est PAS fourni
        if (!propMaisonId) {
            const fetchMaisons = async () => {
                try {
                    const data = await getMyHouseAPI();
                    setMaisons(data);
                } catch (error) {
                    handleError(error); // Utilise votre gestionnaire d'erreurs
                    toast.error("Erreur lors du chargement des maisons.");
                }
            };
            fetchMaisons();
        }
    }, [propMaisonId]); // Dépend de propMaisonId

    // 🧭 Gérer les changements d’input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🚀 Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Définit l'état de soumission
        try {
            await albumSchema.validate(formData, { abortEarly: false });
            setFormErrors({}); // Efface les erreurs précédentes
            const createdAlbum = await createAlbumAPI(formData); // Capture l'album créé si l'API le renvoie
            toast.success("✅ Album créé avec succès !");

            // Si le callback onAlbumCreated est fourni, l'appeler (par exemple, pour fermer la modale)
            if (onAlbumCreated) {
                onAlbumCreated(createdAlbum);
            }

            // Réinitialise le formulaire pour permettre un autre ajout sans fermer la modale
            setFormData({
                nomAlbum: "",
                description: "",
                maisonId: propMaisonId || "", // Conserve l'ID de la maison
            });

        } catch (err) {
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach((e) => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            } else {
                handleError(err); // Utilise votre gestionnaire d'erreurs
            }
        } finally {
            setIsSubmitting(false); // Réinitialise l'état de soumission
        }
    };

    return (
        <form className={`${styles.form} ${variant === 'standalone' ? styles.standalone : ''}`} onSubmit={handleSubmit}>
            {/* <h2 className={styles.title}>Créer un Album</h2> */}

            <InputField
                label="Nom de l'album *"
                name="nomAlbum"
                type="text"
                value={formData.nomAlbum}
                onChange={handleChange}
                error={formErrors.nomAlbum}
                disabled={isSubmitting} // Désactive l'entrée pendant la soumission
            />

            {/* Affiche conditionnellement le SelectField en fonction de propMaisonId */}
            {!propMaisonId && (
                <SelectField
                    label="Maison *"
                    name="maisonId"
                    value={formData.maisonId}
                    onChange={handleChange}
                    options={maisons.map((m) => ({
                        value: m.id,
                        label: m.adresse || `Maison ${m.id}`,
                    }))}
                    error={formErrors.maisonId}
                    disabled={isSubmitting} // Désactive la sélection pendant la soumission
                />
            )}

            <TextareaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description de l'album"
                disabled={isSubmitting} // Désactive la zone de texte pendant la soumission
            />

            <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Enregistrer"}
            </Button>
        </form>
    );
}
