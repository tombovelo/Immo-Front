import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import Button from "../../atoms/Button/Button";
import styles from "./EditPhotoForm.module.scss";
import TextareaField from "../../molecules/TextAreaField/TextAreaField";
import { toast } from "react-toastify";
import { getAlbumAPI } from "../../../services/AlbumService";
import { updatePhotoAPI } from "../../../services/PhotoService";
import { photoSchema } from "../../../validation/PhotoValidation";

export default function EditPhotoForm({ photoToEdit }) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => ({
        albumId: photoToEdit?.album?.id || "",
        description: photoToEdit?.description || "",
        ordre: photoToEdit?.ordre ?? 0,
        file: null, // Le fichier est initialement null
    }));

    const [albums, setAlbums] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    // Pour afficher l'image actuelle ou le nouvel aperçu
    const [imagePreviewUrl, setImagePreviewUrl] = useState(photoToEdit?.cloudinaryUrl || "");

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const data = await getAlbumAPI();
                setAlbums(data.map(alb => ({ value: alb.id, label: alb.nomAlbum || `Album ${alb.id}` })));
            } catch (error) {
                toast.error("Erreur lors du chargement des albums.");
            }
        };
        fetchAlbums();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            // Créer un aperçu pour la nouvelle image
            const reader = new FileReader();
            // "gestionnaire d'événement" qui se déclenche uniquement lorsque le FileReader a terminé sa lecture.
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            //convertit le fichier (dans notre cas, une image) en une chaîne de caractères au format Data URL.
            //"Data URL" ? C'est une longue chaîne de texte qui représente entièrement un fichier.
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Pour la mise à jour, le fichier n'est pas obligatoire.
            // On crée un schéma de validation qui omet la vérification du fichier.
            const editValidationSchema = photoSchema.omit(['file']);
            await editValidationSchema.validate(formData, { abortEarly: false });
            setFormErrors({});

            const data = new FormData();
            data.append("albumId", formData.albumId);
            data.append("description", formData.description);
            data.append("ordre", formData.ordre);
            // Ajouter le fichier seulement s'il a été modifié
            if (formData.file) {
                data.append("file", formData.file);
            }

            await updatePhotoAPI(photoToEdit.id, data);

            toast.success("✅ Photo mise à jour avec succès !");
            navigate('/proprietaire/photos/table'); // Rediriger vers la liste des photos
        } catch (err) {
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach(e => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            } else {
                toast.error("Une erreur est survenue lors de la mise à jour.");
                console.error(err); // Pour le débogage
            }
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Modifier la photo #{photoToEdit.id}</h2>

                <SelectField
                    label="Album *"
                    name="albumId"
                    value={formData.albumId}
                    onChange={handleChange}
                    options={albums}
                    error={formErrors.albumId}
                    isDisabled={true}
                />

                <InputField
                    label="Photo"
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    previewUrl={imagePreviewUrl}
                />

                <TextareaField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description de la photo"
                    error={formErrors.description}
                />

                <InputField
                    label="Ordre d'affichage"
                    name="ordre"
                    type="number"
                    value={formData.ordre}
                    onChange={handleChange}
                    error={formErrors.ordre}
                />

                <Button type="submit" variant="primary">
                    Mettre à jour
                </Button>
            </form>
        </div>
    );
}

