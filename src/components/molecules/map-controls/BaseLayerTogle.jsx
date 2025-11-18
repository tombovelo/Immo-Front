import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import styles from './BaseLayerToggle.module.scss';

const BaseLayerToggle = ({ mapType, setMapType }) => {

  const controlDivRef = useRef(null);

  // Empêche les clics sur les boutons de se propager à la carte,
  // ce qui pourrait déplacer le marqueur.
  useEffect(() => {
    if (controlDivRef.current) {
      L.DomEvent.disableClickPropagation(controlDivRef.current);
    }
  }, []);

  return (
    <div ref={controlDivRef} className={styles.baseLayerToggle}>
      <button
        onClick={() => setMapType("street")}
        className={mapType === 'street' ? styles.active : ''}
      >
        Carte
      </button>
      <button
        onClick={() => setMapType("satellite")}
        className={mapType === 'satellite' ? styles.active : ''}
      >
        Satellite
      </button>
    </div>
  );
};

export default BaseLayerToggle;
