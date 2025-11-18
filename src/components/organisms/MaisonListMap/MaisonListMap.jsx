import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from "react-leaflet";
import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./MaisonListMap.module.scss";

// Import des composants enfants
import BaseLayerToggle from "../../molecules/map-controls/BaseLayerTogle"; // Assurez-vous que ce chemin est correct
import MaisonPopupContent from "../../molecules/map-controls/MaisonPopupContent"; // Assurez-vous que ce chemin est correct
import LocateControl from "../../molecules/map-controls/LocateControl"; // Assurez-vous que ce chemin est correct
import SearchMarker from "../../molecules/map-controls/SearchMarker"; // Assurez-vous que ce chemin est correct
import Routing from "../../molecules/map-controls/Routing"; // Importez le nouveau composant
import RegionLayer from "../../molecules/map-controls/RegionLayer";

// --- Configuration de l'icône (peut être dans un fichier séparé) ---
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// --- Icône rouge pour le marqueur de recherche ---
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- Composant pour gérer les clics sur la carte ---
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

// --- Composant pour mettre à jour la vue de la carte APRÈS UNE RECHERCHE ---
const MapViewUpdater = ({ maisons, searchMarkerPosition }) => {
    
    const map = useMap();

    useEffect(() => {
        // Cet effet ne se déclenche que lorsque la liste des `maisons` change.
        // Un simple clic qui modifie `searchMarkerPosition` ne déclenchera plus cet effet.
        const bounds = L.latLngBounds();
        maisons.forEach(maison => {
            if (maison.latitude != null && maison.longitude != null) {
                const lat = parseFloat(maison.latitude);
                const lng = parseFloat(maison.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                    bounds.extend([lat, lng]);
                }
            }
        });

        if (searchMarkerPosition) {
            bounds.extend(searchMarkerPosition);
        }

        if (bounds.isValid()) {
            // La carte s'ajuste pour tout montrer avec une animation.
            map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }, [maisons, map]); // <-- La dépendance clé est `maisons`

    return null;
};

const tileLayers = {
    street: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }
};

export default function MaisonListMap({ maisons, onMapClick, searchMarkerPosition, distanceKm, onLocationFound, regionFeature }) {

    const [baseLayer, setBaseLayer] = useState('street');
    const [route, setRoute] = useState(null); // État pour stocker l'itinéraire à afficher
    const currentLayer = tileLayers[baseLayer];

    // Ces valeurs ne servent que pour l'affichage initial de la carte.
    // La carte ne sera PAS recentrée à chaque clic.
    const initialCenter = [-18.9333, 47.5167]; // Centre par défaut (Antananarivo)
    const initialZoom = 6;

    const handleItineraryClick = (maison) => {
        if (!searchMarkerPosition) {
            alert("Veuillez d'abord définir votre position en cliquant sur la carte ou en utilisant le bouton de géolocalisation.");
            return;
        }
        setRoute({
            start: searchMarkerPosition,
            end: [parseFloat(maison.latitude), parseFloat(maison.longitude)]
        });
    };

    return (
        <div className={styles.container}>
            <MapContainer
                center={initialCenter}
                zoom={initialZoom}
                scrollWheelZoom={false}
                className={styles.mapContainer}
                // La propriété "key" n'est plus nécessaire ici.
            >
                <TileLayer
                    key={baseLayer} // On garde cette clé pour changer le fond de carte
                    url={currentLayer.url}
                    attribution={currentLayer.attribution}
                />

                {/* Ce nouveau composant gère toutes les mises à jour de la vue après une recherche */}
                <MapViewUpdater maisons={maisons} searchMarkerPosition={searchMarkerPosition} />

                {/* Ajout du contrôle de géolocalisation sur la carte */}
                <LocateControl onLocationFound={onLocationFound} />

                {/* Ce composant écoute les clics sur la carte */}
                <MapClickHandler onMapClick={onMapClick} />

                {/* Affiche le marqueur de recherche si une position a été cliquée/géolocalisée */}
                {searchMarkerPosition && <SearchMarker position={searchMarkerPosition} icon={redIcon} />}

                {/* Affiche le cercle de recherche si une position et une distance sont définies */}
                {searchMarkerPosition && distanceKm > 0 && (
                    <Circle
                        center={searchMarkerPosition}
                        radius={distanceKm * 1000} // Convertir km en mètres
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                    />
                )}

                {maisons.map(maison => {
                    if (maison.latitude != null && maison.longitude != null) {
                        const lat = parseFloat(maison.latitude);
                        const lng = parseFloat(maison.longitude);
                        if (!isNaN(lat) && !isNaN(lng)) {
                            return (
                                <React.Fragment key={maison.id}>
                                    <Marker position={[lat, lng]} icon={DefaultIcon}>
                                        <Popup>
                                            <MaisonPopupContent 
                                                maison={maison} 
                                                onItineraryClick={() => handleItineraryClick(maison)}
                                            />
                                        </Popup>
                                    </Marker>
                                </React.Fragment>
                            );
                        }
                    }
                    return null;
                })}

                {/* Affiche l'itinéraire si un trajet est défini */}
                {/* {route && <Routing start={route.start} end={route.end} />} */}

                <RegionLayer region={regionFeature} />
                
                <BaseLayerToggle mapType={baseLayer} setMapType={setBaseLayer} />
            </MapContainer>
        </div>
    );
}
