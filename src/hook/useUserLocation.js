import { useState, useCallback } from "react";

// Hook pour récupérer la position de l'utilisateur
export function useUserLocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getUserLocation = useCallback(() => {
        
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            const errorMsg = "La géolocalisation n'est pas supportée par votre navigateur.";
            setError(errorMsg);
            setIsLoading(false);
            return Promise.reject(new Error(errorMsg));
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    setLocation(userLocation);
                    setError(null);
                    setIsLoading(false);
                    resolve(userLocation);
                },
                (err) => {
                    let errorMessage;
                    
                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            errorMessage = "Permission de géolocalisation refusée. Veuillez autoriser l'accès à votre position.";
                            break;
                        case err.POSITION_UNAVAILABLE:
                            errorMessage = "Information de localisation indisponible.";
                            break;
                        case err.TIMEOUT:
                            errorMessage = "La demande de localisation a expiré.";
                            break;
                        default:
                            errorMessage = "Une erreur inconnue s'est produite lors de la géolocalisation.";
                            break;
                    }
                    
                    setError(errorMessage);
                    setIsLoading(false);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // Augmenté à 15 secondes
                    maximumAge: 60000, // Cache de 1 minute
                }
            );
        });
    }, []);

    // Fonction pour réinitialiser la localisation
    const resetLocation = useCallback(() => {
        setLocation(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return { 
        location, 
        error, 
        isLoading, 
        getUserLocation, 
        resetLocation 
    };
}