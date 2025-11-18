import React, { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import styles from "./LocateControl.module.scss";
import { FaCrosshairs } from "react-icons/fa";

const LocateControl = ({ onLocationFound }) => {
    
    const map = useMap();
    const controlDivRef = useRef(null);

    // On utilise un effet pour désactiver la propagation des clics sur le conteneur du contrôle
    useEffect(() => {
        if (controlDivRef.current) {
            // C'est la manière la plus robuste d'empêcher les clics sur le contrôle de se propager à la carte
            L.DomEvent.disableClickPropagation(controlDivRef.current);
        }
    }, []);


    // Écoute les événements de localisation de Leaflet
    useMapEvents({
        locationfound(e) {
            // On zoome à un niveau élevé pour voir les détails (niveau rue)
            map.flyTo(e.latlng, 18); 
            onLocationFound(e.latlng);
        },
        locationerror(e) {
            alert("Impossible de vous localiser. Assurez-vous d'avoir autorisé l'accès à votre position dans votre navigateur.");
            console.error(e.message);
        },
    });

    const handleLocate = () => {
        // On demande explicitement la haute précision pour utiliser le GPS si disponible
        map.locate({ enableHighAccuracy: true }); 
    };

    // Ce bouton sera ajouté par-dessus la carte
    return (
        <div ref={controlDivRef} className={styles.locateControl}>
            <button onClick={handleLocate} title="Me localiser">
                <FaCrosshairs />
            </button>
        </div>
    );
};

export default LocateControl;
