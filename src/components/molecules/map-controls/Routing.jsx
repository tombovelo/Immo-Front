import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const Routing = ({ start, end }) => {
    
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      // Personnalisation pour ne pas afficher les marqueurs par défaut de l'itinéraire
      createMarker: function() { return null; },
      // Personnalisation de l'affichage de l'itinéraire
      lineOptions: {
        styles: [{ color: '#6FA1EC', opacity: 0.7, weight: 5 }]
      },
      // Cache le panneau d'instructions textuelles
      show: false,
      // Ajoute les points de passage sans les rendre déplaçables
      addWaypoints: false,
      // Permet de s'adapter au zoom
      fitSelectedRoutes: true,
    }).addTo(map);

    // Nettoyage lors du démontage du composant
    return () => map.removeControl(routingControl);

  }, [map, start, end]);

  return null;
};

export default Routing;
