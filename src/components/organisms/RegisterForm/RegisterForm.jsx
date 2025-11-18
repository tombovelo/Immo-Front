import { useState } from "react";
import InputField from "../../molecules/InputField/InputField";
import Button from "../../atoms/Button/Button";
import styles from "./RegisterForm.module.scss";
import { useAuth } from "../../../context/userAuth";
import { registerSchema } from "../../../validation/RegisterValidation";
import { Link } from "react-router-dom";

export default function ProprietaireForm() {

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        adresse: "",
        file: null,
        utilisateur: {
            email: "",
            password: "",
        },
    });

    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const { registerUser } = useAuth();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // handleChange est appelé à chaque fois que l’utilisateur tape dans un input.
    const handleChange = (e) => {
        // e.target contient l’input qui a changé
        //name → le nom du champ (nom, prenom, ou utilisateur.email, etc.)
        const { name, value } = e.target;
        // Vérifie si le champ contient un point (indiquant un objet imbriqué (utilisateur))
        if (name.includes(".")) {
            // Gestion des champs imbriqués (ex: "utilisateur.email")
            // On sépare le nom en deux parties : parent et enfant
            const [parent, child] = name.split(".");
            // Met à jour l'état du formulaire
            setFormData(prev => ({
                // Copie toutes les propriétés existantes
                ...prev,
                // Met à jour uniquement la propriété parente
                [parent]: {
                    // Copie les anciennes valeurs de l'objet parent
                    ...prev[parent],
                    // Met à jour uniquement la propriété enfant
                    [child]: value
                },
            }));
        } else {
            // Pour les champs simples (nom, prenom, etc.)
            setFormData(prev => ({
                // Copie toutes les propriétés existantes
                ...prev,
                // Met à jour uniquement le champ modifié
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerSchema.validate(formData, { abortEarly: false });
            setFormErrors({});

            const data = new FormData();
            data.append("nom", formData.nom);
            data.append("prenom", formData.prenom);
            data.append("telephone", formData.telephone);
            data.append("adresse", formData.adresse);
            data.append("utilisateur.email", formData.utilisateur.email);
            data.append("utilisateur.password", formData.utilisateur.password);
            if (formData.file) {
                data.append("file", formData.file);
            }

            await registerUser(data);

            setFormData({
                nom: "", prenom: "",
                telephone: "", adresse: "",
                file: null,
                utilisateur: {
                    email: "",
                    password: "",
                },
            });
            setImagePreviewUrl("");
            e.target.reset();

        } catch (err) {
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach((e) => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            }
        }

    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h4 className={styles.title}>S'INSCRIRE</h4>
            <InputField
                label="Nom *"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                error={formErrors.nom}
            />
            <InputField
                label="Prénom"
                name="prenom"
                type="text"
                value={formData.prenom}
                onChange={handleChange}
            />

            <InputField
                label="Photo de profil *"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                error={formErrors.file}
                previewUrl={imagePreviewUrl}
            />

            <div className={styles.multiFields}>
                <InputField
                    label="Téléphone *"
                    name="telephone"
                    type="text"
                    value={formData.telephone}
                    onChange={handleChange}
                    error={formErrors.telephone}
                />
                <InputField
                    label="Email *"
                    name="utilisateur.email"
                    type="email"
                    value={formData.utilisateur.email}
                    onChange={handleChange}
                    error={formErrors["utilisateur.email"]}
                />
            </div>

            <InputField
                label="Adresse"
                name="adresse"
                type="text"
                value={formData.adresse}
                onChange={handleChange}
            />

            <InputField
                label="Mot de passe *"
                name="utilisateur.password"
                type="password"
                value={formData.utilisateur.password}
                onChange={handleChange}
                error={formErrors["utilisateur.password"]}
            />
            <Button type="submit">Enregistrer</Button>
            <p className={styles.loginPrompt}>
                Vous avez déjà un compte ? <Link to="/login" className={styles.loginLink}>Se connecter</Link>
            </p>
        </form>
    );
}
