import React, { useEffect, useRef } from 'react';
import { Marker, Popup } from "react-leaflet";

const SearchMarker = ({ position, icon }) => {
    const markerRef = useRef(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [position]);

    return (
        <Marker ref={markerRef} position={position} icon={icon}>
            <Popup>
                Vous êtes ici !
            </Popup>
        </Marker>
    );
};

export default SearchMarker;
