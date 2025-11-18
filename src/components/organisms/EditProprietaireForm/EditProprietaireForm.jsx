import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../molecules/InputField/InputField";
import Button from "../../atoms/Button/Button";
import styles from './EditProprietaireForm.module.scss';
import { toast } from "react-toastify";
import { updateMyProfile } from "../../../services/ProprietaireService";
import { useAuth } from "../../../context/userAuth";

export default function EditProprietaireForm({ proprietaireToEdit, variant = 'standalone' }) {

    const navigate = useNavigate();
    const { user, updateUser } = useAuth();


    const [formData, setFormData] = useState(() => ({
        nom: proprietaireToEdit?.nom || "",
        prenom: proprietaireToEdit?.prenom || "",
        telephone: proprietaireToEdit?.telephone || "",
        adresse: proprietaireToEdit?.adresse || "",
        file: null,
        utilisateur: {
            email: proprietaireToEdit?.utilisateur?.email || "",
            password: "", // Laisser vide pour ne pas changer
        },
    }));

    const [imagePreviewUrl, setImagePreviewUrl] = useState(proprietaireToEdit?.urlProfile || "");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("nom", formData.nom);
            data.append("prenom", formData.prenom);
            data.append("telephone", formData.telephone);
            data.append("adresse", formData.adresse);
            data.append("utilisateur.email", formData.utilisateur.email);

            if (formData.utilisateur.password) {
                data.append("utilisateur.password", formData.utilisateur.password);
            }

            if (formData.file) {
                data.append("file", formData.file);
            }

            await updateUser(data);
            
        } catch (err) {
            toast.error("Une erreur est survenue lors de la mise à jour.");
            console.error(err);
        }
    };

    return (
        <form className={`${styles.form} ${variant === 'standalone' ? styles.standalone : ''}`} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Modifier mon profil</h2>

            <InputField
                label="Nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
            />

            <InputField
                label="Prénom"
                name="prenom"
                type="text"
                value={formData.prenom}
                onChange={handleChange}
            />

            <InputField
                label="Image"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                previewUrl={imagePreviewUrl}
            />
            <div className={styles.multiFields}>
                <InputField
                    label="Téléphone"
                    name="telephone"
                    type="text"
                    value={formData.telephone}
                    onChange={handleChange}
                />

                <InputField
                    label="Email"
                    name="utilisateur.email"
                    type="email"
                    value={formData.utilisateur.email}
                    onChange={handleChange}
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
                label="Nouveau mot de passe"
                name="utilisateur.password"
                type="password"
                value={formData.utilisateur.password}
                onChange={handleChange}
                placeholder="Laissez vide pour ne pas changer"
            />

            <Button type="submit" variant="primary">
                Mettre à jour
            </Button>
        </form>
    );
}
