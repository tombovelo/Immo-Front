import { useEffect } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import PropTypes from "prop-types";

/**
 * Affiche une couche GeoJSON pour une région et zoome automatiquement dessus.
 * @param {object} props
 * @param {object} props.region - La feature GeoJSON de la région à afficher.
 */
const RegionLayer = ({ region }) => {
  const map = useMap();

  useEffect(() => {
    // S'assurer que la région et sa géométrie existent
    if (region && region.geometry) {
      const geoJsonLayer = L.geoJSON(region);
      const bounds = geoJsonLayer.getBounds();

      // Zoomer sur la région uniquement si les limites sont valides
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [region, map]);

  // Ne rien afficher si la région n'est pas fournie
  if (!region) {
    return null;
  }

  // Style pour le contour de la région
  const regionStyle = {
    fillColor: "#3388ff",
    fillOpacity: 0.2,
    color: "#3388ff",
    weight: 3,
    opacity: 0.8,
  };

  return <GeoJSON key={region.properties.shapeID} data={region} style={regionStyle} />;
};

RegionLayer.propTypes = {
  /** La feature GeoJSON de la région à afficher */
  region: PropTypes.object,
};

export default RegionLayer;

