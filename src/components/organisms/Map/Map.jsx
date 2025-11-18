import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./Map.module.scss";
import BaseLayerToggle from "../../molecules/map-controls/BaseLayerTogle";
import RegionLayer from "../../molecules/map-controls/RegionLayer";
import LocateControl from "../../molecules/map-controls/LocateControl";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Configuration de l'icône par défaut pour Leaflet
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;


export default function Map({ onLocationSelect, initialPosition, wrapperClassName, mapContainerClassName, regionFeature }) {
  
  const [mapType, setMapType] = useState("street");
  const [position, setPosition] = useState(initialPosition || null);

  // Callback function to handle location found by LocateControl
  const handleLocationFound = (latlng) => {
    const newPos = { lat: latlng.lat, lng: latlng.lng };
    setPosition(newPos);
    if (onLocationSelect) onLocationSelect(newPos);
  };

  // Marqueur qui se déplace au clic et met à jour la position
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newPos = e.latlng;
        setPosition(newPos);
        if (onLocationSelect) onLocationSelect(newPos);
      },
    });

    const map = useMap();
    useEffect(() => {
      // Recentrer sur le marqueur seulement si aucune province n'est sélectionnée
      if (position && !regionFeature) {
        map.flyTo(position, map.getZoom());
      }
    }, [position, map, regionFeature]);

    if (!position) return null;

    return (
      <Marker position={position}>
        <Popup>
          Latitude: {position.lat.toFixed(5)} <br /> Longitude: {position.lng.toFixed(5)}
        </Popup>
      </Marker>
    );
  }

  const getTileLayer = () => {
    switch (mapType) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "Tiles © Esri",
        };
      default: // street
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
    }
  };

  // Default center for MapContainer if position is null initially
  const defaultMapCenter = { lat: -18.8792, lng: 47.5079 }; // Antananarivo par défaut

  return (
    <div className={`${styles.container} ${wrapperClassName || ''}`}>
      <MapContainer
        center={position || defaultMapCenter} // Use current position or default if not yet set
        zoom={6} // Zoom initial large pour voir tout Madagascar
        scrollWheelZoom={true}
        doubleClickZoom={false}
        className={`${styles.mapContainer} ${mapContainerClassName || ''}`}
      >
        <BaseLayerToggle mapType={mapType} setMapType={setMapType} />
        <TileLayer {...getTileLayer()} key={mapType} />
        <LocationMarker />
        <RegionLayer region={regionFeature} />
        <LocateControl onLocationFound={handleLocationFound} /> {/* Integrate LocateControl */}
      </MapContainer>
      {position === null && <div className={styles.loading}>Chargement de la carte...</div>}
    </div>
  );
}
