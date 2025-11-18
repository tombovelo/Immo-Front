import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from './MaisoInMap.module.scss'; // Réutilisation des styles de EditMap
import MaisonPopupContent from "../../molecules/map-controls/MaisonPopupContent";
import BaseLayerToggle from "../../molecules/map-controls/BaseLayerTogle";

// La configuration de l'icône est dupliquée depuis EditMap.
// Pourrait être déplacé dans un fichier partagé pour éviter la duplication.
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Affiche une maison sur une carte en mode lecture seule, avec un niveau de zoom spécifique.
 * Ce composant est autonome et n'est pas éditable.
 *
 * @param {object} props
 * @param {object} props.maison - L'objet maison contenant `latitude` et `longitude`.
 * @param {number} [props.zoom=18] - Le niveau de zoom de la carte.
 * @param {string} [props.wrapperClassName] - Classe CSS pour le conteneur principal.
 * @param {string} [props.mapContainerClassName] - Classe CSS pour le conteneur de la carte.
 */
export default function MaisonInMap({ maison, zoom = 18, wrapperClassName, mapContainerClassName }) {

    const [mapType, setMapType] = useState("street");

    // La logique de getTileLayer est dupliquée depuis EditMap.
    const getTileLayer = () => {
        switch (mapType) {
            case "satellite":
                return {
                    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                    attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
                    maxNativeZoom: 19,
                    maxZoom: 20,
                };
            default:
                return {
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxNativeZoom: 19,
                    maxZoom: 20,
                };
        }
    };

    const position = useMemo(() => {
        if (maison && maison.latitude != null && maison.longitude != null) {
            const lat = parseFloat(maison.latitude);
            const lng = parseFloat(maison.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                return { lat, lng };
            }
        }
        return null;
    }, [maison]);

    if (!position) {
        return <div>Les coordonnées de la maison ne sont pas disponibles pour afficher la carte.</div>;
    }

    return (
        <div className={`${styles.container} ${wrapperClassName || ''}`}>
            <MapContainer
                center={position}
                zoom={zoom}
                scrollWheelZoom={false}
                className={`${styles.mapContainer} ${mapContainerClassName || ''}`}
            >
                <TileLayer {...getTileLayer()} key={mapType} />

                <BaseLayerToggle mapType={mapType} setMapType={setMapType} />

                <Marker position={position} draggable={false} keyboard={false}>
                    <Popup>
                        <MaisonPopupContent maison={maison} />
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

