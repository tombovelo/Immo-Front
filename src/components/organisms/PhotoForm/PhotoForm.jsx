import { useState, useEffect } from "react";
import InputField from "../../molecules/InputField/InputField";
import TextareaField from "../../molecules/TextAreaField/TextAreaField";
import SelectField from "../../molecules/SelectField/SelectField";
import Button from "../../atoms/Button/Button";
import styles from "./PhotoForm.module.scss";
import { getAlbumAPI } from "../../../services/AlbumService";
import { getMyHouseAPI } from "../../../services/MaisonService";// Importer l'API des maisons
import { createPhotoAPI } from "../../../services/PhotoService";
import { toast } from "react-toastify";
import { photoSchema } from "../../../validation/PhotoValidation";
import { handleError } from "../../../helpers/ErrorHandler";


export default function PhotoForm({ albumId: propAlbumId, onPhotoCreated, variant = 'standalone' }) {

    const [formData, setFormData] = useState({
        albumId: propAlbumId || "", // 🔥 Initialisé avec la prop
        file: null,
        description: "",
        ordre: "0",
    });

    const [houses, setHouses] = useState([]); // Pour stocker les maisons de l'utilisateur
    const [selectedHouseId, setSelectedHouseId] = useState(""); // Pour l'ID de la maison sélectionnée
    const [allUserAlbums, setAllUserAlbums] = useState([]); // Pour stocker tous les albums
    const [albums, setAlbums] = useState([]); // Pour les albums filtrés à afficher
    const [formErrors, setFormErrors] = useState({});
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // State pour la clé du champ fichier
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    // Récupérer les maisons et tous les albums de l'utilisateur au montage
    useEffect(() => {
        // On ne charge les données que si on n'est pas en mode "ajout direct"
        if (!propAlbumId) {
            const fetchInitialData = async () => {
                try {
                    const housesData = await getMyHouseAPI();
                    const albumsData = await getAlbumAPI();
                    setHouses(housesData);
                    setAllUserAlbums(albumsData);
                } catch (error) {
                    toast.error(
                        "Erreur lors de la récupération de vos données (maisons/albums)."
                    );
                }
            };
            fetchInitialData();
        }
    }, [propAlbumId]);

    // Mettre à jour la liste des albums lorsque l'utilisateur sélectionne une maison
    useEffect(() => {
        // Ce hook n'est utile que si on n'a pas d'albumId via les props
        if (!propAlbumId) {
            if (selectedHouseId) {
                // On suppose que chaque album a une propriété `maisonId`
                const filteredAlbums = allUserAlbums.filter(
                    (album) => album.maison.id == selectedHouseId
                );
                setAlbums(filteredAlbums);
            } else {
                setAlbums([]); // Vider la liste si aucune maison n'est sélectionnée
            }
            // Réinitialiser la sélection de l'album dans le formulaire
            setFormData((prev) => ({ ...prev, albumId: "" }));
        }
    }, [selectedHouseId, allUserAlbums, propAlbumId]);

    // Gestionnaire pour la sélection d'une maison
    const handleHouseChange = (e) => {
        setSelectedHouseId(e.target.value);
    };

    // 📝 Gestion des champs texte
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 📸 Gestion du fichier
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, file }));
        if (file) {
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

    // 🚀 Envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await photoSchema.validate(formData, { abortEarly: false });

            const data = new FormData();
            data.append("albumId", formData.albumId); // 🔥 Changé de "id" à "albumId"
            data.append("file", formData.file);
            data.append("description", formData.description);
            data.append("ordre", formData.ordre || 0);


            const response = await createPhotoAPI(data);

            if (response) {
                toast.success("✅ Photo ajoutée avec succès !");
                if (onPhotoCreated) {
                    onPhotoCreated(response);
                }
                // Réinitialiser le formulaire pour un nouvel ajout
                setFormData({
                    albumId: propAlbumId || "", // Conserver l'albumId
                    file: null,
                    description: "",
                    ordre: "0",
                });
                setImagePreviewUrl(""); // Vider l'aperçu
                setFileInputKey(Date.now()); // On change la clé pour forcer la réinitialisation du champ
                setFormErrors({});
            }

        } catch (err) {
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach((e) => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            } else {
                handleError(err);
            }
        }
    };

    return (
        <form className={`${styles.form} ${variant === 'standalone' ? styles.standalone : ''}`} onSubmit={handleSubmit}>
            {/* <h2 className={styles.title}>Ajouter une photo</h2> */}
            
            {!propAlbumId && (
                <>
                    <SelectField
                        label="Maison *"
                        name="house"
                        value={selectedHouseId}
                        onChange={handleHouseChange}
                        options={houses.map((house) => ({
                            value: house.id,
                            label: house.adresse || `Maison ${house.id}`,
                        }))}
                    />

                    <SelectField
                        label="Album *"
                        name="albumId" // 🔥 Ce nom doit correspondre à celui dans formData
                        value={formData.albumId} // 🔥 Changé de formData.id à formData.albumId
                        onChange={handleChange}
                        options={albums.map((alb) => ({
                            value: alb.id,
                            label: alb.nomAlbum || `album ${alb.id}`,
                        }))}
                        error={formErrors["albumId"]}
                        isDisabled={!selectedHouseId}
                    />
                </>
            )}

            <InputField
                label="Fichier photo *"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                error={formErrors["file"]}
                previewUrl={imagePreviewUrl}
            />

            <TextareaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description de la photo"
            />

            <Button type="submit" variant="primary">
                Envoyer
            </Button>
        </form>
    );
}