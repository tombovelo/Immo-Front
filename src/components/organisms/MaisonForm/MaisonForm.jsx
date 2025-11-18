// src/components/organisms/MaisonForm/MaisonForm.jsx
import { useState, useEffect } from "react";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import Button from "../../atoms/Button/Button";
import styles from "./MaisonForm.module.scss";
import TextareaField from "../../molecules/TextAreaField/TextAreaField";
import Map from "../Map/Map";
import { maisonSchema } from "../../../validation/MaisonValidation";
import { toast } from "react-toastify";
import { getTransactionAPI } from "../../../services/TypeTransactionService";
import { createHouseAPI } from "../../../services/MaisonService";
import { useNavigate } from "react-router-dom";
import { getProprietaireAPI } from "../../../services/ProprietaireService";
import { regionsMadagascar } from "../../../constants/location";
import regionsGeoJSON from "../../../constants/region-mada.geojson.json";


export default function MaisonForm() {

    const [formData, setFormData] = useState({
        adresse: "",
        ville: "",
        codePostal: "",
        nombrePieces: "",
        prix: "",
        description: "",
        latitude: "",
        longitude: "",
        typeTransactionId: "",
        file: null,
    });

    const [typeOptions, setTypeOptions] = useState([]);
    const [proprietaireOptions, setProprietaireOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const navigate = useNavigate();

    // 📦 Charger les types de transaction et les propriétaires depuis l’API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Exécute les deux appels API en parallèle
                const [transactionData, proprietaireData] = await Promise.all([
                    getTransactionAPI(),
                    getProprietaireAPI()
                ]);

                // Met à jour les options des types de transaction
                setTypeOptions(transactionData.map(t => ({ value: t.id, label: t.nom })));

                // Met à jour les options des propriétaires
                setProprietaireOptions(
                    proprietaireData.map(p => ({ value: p.id, label: `${p.prenom || ''} ${p.nom}`.trim() }))
                );
            } catch (error) {
                toast.error("Erreur lors du chargement des données.");
                console.error("Erreur lors du chargement des données:", error); // Ajout d'un log pour le débogage
            }
        };
        fetchData();
    }, []); // Le tableau de dépendances est vide car ces données sont chargées une seule fois au montage du composant


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

    // ✏️ Mettre à jour les champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Si la province est changée, on met à jour les limites pour la carte
        if (name === "ville") {
            // Trouver la feature GeoJSON correspondante en utilisant la normalisation
            const normalizedValue = normalizeString(value);
            console.log(normalizedValue);
            const regionFeature = regionsGeoJSON.features.find((feature) =>
                normalizeString(feature.properties.shapeName) === normalizedValue
            );
            setSelectedRegion(regionFeature);
        }
    };

    // Fonction pour "normaliser" une chaîne de caractères : minuscules, sans espaces, tirets ou apostrophes.
    const normalizeString = (str) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .replace(/['\- ]/g, ""); // Supprime les apostrophes, tirets et espaces
    };

    // 🚀 Envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await maisonSchema.validate(formData, { abortEarly: false });
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
            data.append("typeTransactionId", formData.typeTransactionId);
            if (formData.file) {
                data.append("file", formData.file);
            }
            await createHouseAPI(data);
            toast.success("✅ Maison enregistrée avec succès !");
            setFormData({
                adresse: "",
                ville: "",
                codePostal: "",
                nombrePieces: "",
                prix: "",
                description: "",
                latitude: "",
                longitude: "",
                typeTransactionId: "",
                file: null,
            });
            setImagePreviewUrl("");
            navigate("/proprietaire/maisons/table");
        } catch (err) {
            if (err.name === "ValidationError") {
                const errors = {};
                err.inner.forEach(e => {
                    errors[e.path] = e.message;
                });
                setFormErrors(errors);
            }
        }
    };

    return (
        <div className={styles.twoColumn}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Ajouter une maison</h2>
                <div className={styles.multiFields}>
                    <InputField
                        label="Adresse"
                        name="adresse"
                        type="text"
                        value={formData.adresse}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Image"
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        previewUrl={imagePreviewUrl}
                        error={formErrors.file}
                    />
                </div>

                <SelectField
                    label="Région *"
                    name="ville"
                    // type="text"
                    value={formData.ville}
                    onChange={handleChange}
                    options={regionsMadagascar}
                    error={formErrors.ville}
                />

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
                <TextareaField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Votre description"
                />

                <Button type="submit" variant="primary">Enregistrer</Button>
            </form>
            <Map
                wrapperClassName={styles.mapWrapper} // Classe pour le div externe du composant Map
                mapContainerClassName={styles.map} // Classe pour le MapContainer interne de react-leaflet
                initialPosition={{ lat: -18.8792, lng: 47.5079 }}
                regionFeature={selectedRegion}
                onLocationSelect={(coords) => setFormData(prev => ({ ...prev, latitude: coords.lat, longitude: coords.lng }))}
            />
        </div>
    );
}
