import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import Button from "../../atoms/Button/Button";
import styles from "./EditMaisonForm.module.scss";
import TextareaField from "../../molecules/TextAreaField/TextAreaField";
import { maisonSchema } from "../../../validation/MaisonValidation";
import { toast } from "react-toastify";
import { getTransactionAPI } from "../../../services/TypeTransactionService";
import { updateHouseAPI } from "../../../services/MaisonService";
import EditMap from "../EditMap/EditMap";
import { regionsMadagascar } from "../../../constants/location";
import regionsGeoJSON from "../../../constants/region-mada.geojson.json";


export default function EditMaisonForm({ maisonToEdit }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => ({
        adresse: maisonToEdit?.adresse || "",
        ville: maisonToEdit?.ville || "",
        codePostal: maisonToEdit?.codePostal || "",
        nombrePieces: maisonToEdit?.nombrePieces || "",
        prix: maisonToEdit?.prix || "",
        description: maisonToEdit?.description || "",
        latitude: maisonToEdit?.latitude || "",
        longitude: maisonToEdit?.longitude || "",
        //visible: maisonToEdit?.visible ?? true,
        typeTransactionId: maisonToEdit?.typeTransaction?.id || "",
        file: null, // 1. Ajout de l'état pour le fichier
    }));

    const [typeOptions, setTypeOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    // 2. Ajout de l'état pour l'aperçu de l'image (initialisé avec l'image actuelle)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(maisonToEdit?.cloudinaryUrl || "");

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await getTransactionAPI();
                setTypeOptions(data.map(t => ({ value: t.id, label: t.nom })));
            } catch (error) {
                toast.error("Erreur lors du chargement des types de transaction.");
            }
        };
        fetchTypes();
    }, []);

    // Initialiser la région sélectionnée au montage
    useEffect(() => {
        if (maisonToEdit?.ville) {
            const regionFeature = regionsGeoJSON.features.find(
                (feature) => normalizeString(feature.properties.shapeName) === normalizeString(maisonToEdit.ville)
            );
            setSelectedRegion(regionFeature);
        }
    }, [maisonToEdit?.ville]);

    const normalizeString = (str) => {
        if (!str) return '';
        return str.toLowerCase().replace(/['\- ]/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "ville") {
            const regionFeature = regionsGeoJSON.features.find(
                (feature) => normalizeString(feature.properties.shapeName) === normalizeString(value)
            );
            setSelectedRegion(regionFeature);
        }
    };

    // 3. Ajout du gestionnaire pour le changement de fichier
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

    // 4. Correction de la logique de soumission pour utiliser FormData
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Pour la mise à jour, le fichier n'est pas obligatoire.
            const updateSchema = maisonSchema.omit(['file']);
            const validationData = { ...formData };
            delete validationData.file;

            await updateSchema.validate(validationData, { abortEarly: false });
            setFormErrors({});

            const data = new FormData();
            data.append("adresse", formData.adresse);
            data.append("ville", formData.ville);
            data.append("codePostal", formData.codePostal);
            data.append("nombrePieces", formData.nombrePieces);
            data.append("prix", formData.prix);
            data.append("description", formData.description);
            data.append("latitude", formData.latitude);
            data.append("longitude", formData.longitude);
            //data.append("visible", formData.visible);
            data.append("typeTransactionId", formData.typeTransactionId);

            // On ajoute le fichier seulement si un nouveau a été sélectionné
            if (formData.file) {
                data.append("file", formData.file);
            }

            await updateHouseAPI(maisonToEdit.id, data);

            toast.success("✅ Maison mise à jour avec succès !");
            navigate('/proprietaire/maisons/table');
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
        }
    };

    const initialMapPosition = formData.latitude && formData.longitude
        ? { lat: formData.latitude, lng: formData.longitude }
        : { lat: -18.8792, lng: 47.5079 };

    return (
        <div className={styles.twoColumn}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Modifier la maison #{maisonToEdit.id}</h2>

                <InputField
                    label="Adresse"
                    name="adresse"
                    type="text"
                    value={formData.adresse}
                    onChange={handleChange}
                />

                {/* 5. Ajout du champ pour changer l'image */}
                <InputField
                    label="Image"
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    previewUrl={imagePreviewUrl}
                />

                <SelectField
                    label="Région *"
                    name="ville"
                    value={formData.ville}
                    options={regionsMadagascar}
                    onChange={handleChange}
                    error={formErrors.ville}
                />

                <div className={styles.multiFields}>
                    <SelectField
                        label="Transaction *"
                        name="typeTransactionId"
                        value={formData.typeTransactionId}
                        onChange={handleChange}
                        options={typeOptions}
                        error={formErrors.typeTransactionId}
                    />
                    <InputField
                        label="Code postal"
                        name="codePostal"
                        type="text"
                        value={formData.codePostal}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.multiFields}>
                    <InputField
                        label="Pièces *"
                        name="nombrePieces"
                        type="number"
                        value={formData.nombrePieces}
                        onChange={handleChange}
                        error={formErrors.nombrePieces}
                    />
                    <InputField
                        label="Prix *"
                        name="prix"
                        type="text"
                        value={formData.prix}
                        onChange={handleChange}
                        error={formErrors.prix}
                    />
                </div>
                <div className={styles.multiFields}>
                    <InputField
                        label="Latitude *"
                        name="latitude"
                        type="text"
                        value={formData.latitude}
                        onChange={handleChange}
                        error={formErrors.latitude}
                    />
                    <InputField
                        label="Longitude *"
                        name="longitude"
                        type="text"
                        value={formData.longitude}
                        onChange={handleChange}
                        error={formErrors.longitude}
                    />
                </div>
                <TextareaField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Votre description"
                />
                <Button type="submit" variant="primary">Mettre à jour</Button>
            </form>
            <EditMap
                wrapperClassName={styles.mapWrapper} // Classe pour le div externe du composant Map
                mapContainerClassName={styles.map} // Classe pour le MapContainer interne de react-leaflet
                maison={maisonToEdit}
                onLocationChange={(coords) => setFormData(prev => ({ ...prev, latitude: coords.lat, longitude: coords.lng }))}
                regionFeature={selectedRegion}
            />
        </div>
    );
}
