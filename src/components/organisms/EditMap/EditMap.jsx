import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./EditMap.module.scss";
import MaisonPopupContent from "../../molecules/map-controls/MaisonPopupContent"; // Assurez-vous que ce chemin est correct
import BaseLayerToggle from "../../molecules/map-controls/BaseLayerTogle";
import RegionLayer from "../../molecules/map-controls/RegionLayer";

// Réutilisation de la configuration de l'icône par défaut
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function EditMap({ maison, onLocationChange, wrapperClassName, mapContainerClassName, regionFeature }) {

    const [mapType, setMapType] = useState("street");

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

    // La position est dérivée de la prop `maison`
    const position = useMemo(() => {
        if (maison && maison.latitude != null && maison.longitude != null) {
            const lat = parseFloat(maison.latitude);
            const lng = parseFloat(maison.longitude);

            // S'assure que la conversion en nombre a réussi
            if (!isNaN(lat) && !isNaN(lng)) {
                return { lat, lng };
            }
        }
        return null; // Pas de position si pas de données
    }, [maison]);

    const [markerPosition, setMarkerPosition] = useState(position);

    // Mettre à jour la position du marqueur si la maison change
    useEffect(() => {
        setMarkerPosition(position);
    }, [position]);

    // Gère les clics sur la carte pour mettre à jour la position
    function LocationClickHandler() {
        useMapEvents({
            click(e) {
                setMarkerPosition(e.latlng);
                if (onLocationChange) {
                    onLocationChange(e.latlng);
                }
            },
        });
        return null;
    }

    // Centre la carte sur la position
    function UpdateMapCenter({ pos, region }) {
        const map = useMap();
        useEffect(() => {
           // Ne recentrer que si aucune région n'est sélectionnée
           if (pos && !region) {
                map.setView(pos, map.getZoom() || 16);
            }
        }, [pos, region, map]);
        return null;
    }

    if (!position) {
        return <div className={styles.container}>Chargement de la carte...</div>;
    }

    return (
        <div className={`${styles.container} ${wrapperClassName || ''}`}>
            <MapContainer center={position} zoom={16} scrollWheelZoom className={`${styles.mapContainer} ${mapContainerClassName || ''}`}>
                <TileLayer {...getTileLayer()} key={mapType} />
                <UpdateMapCenter pos={markerPosition} region={regionFeature} />

                <LocationClickHandler />

                <BaseLayerToggle mapType={mapType} setMapType={setMapType} />

                {markerPosition && (
                    <Marker position={markerPosition}>
                        <Popup>
                            <MaisonPopupContent maison={maison} />
                        </Popup>
                    </Marker>
                )}
                <RegionLayer region={regionFeature} />
            </MapContainer>
        </div>
    );
}
