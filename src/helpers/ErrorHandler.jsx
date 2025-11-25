import axios from "axios"
import { toast } from "react-toastify";

// export const handleError = (error) => {
//     if (axios.isAxiosError(error)) {
//         var err = error.response;
//         if (Array.isArray(err?.data.errors)) {
//             for (let val of err.data.errors) {
//                 toast.warning(val.description)
//             }
//         } else if (typeof err?.data.errors === 'object') {
//             for (let key in err.data.errors) {
//                 const message = err.data.errors[key];
//                 toast.warning(typeof message === "string" ? message : message[0]);
//             }
//         } else if (err?.data) {
//             toast.warning(err.data)
//         } else if(err?.status == 401) {
//             toast.warning("Veuillez vous connecter");
//             window.history.pushState({}, "LoginPage", "/login");
//         } else if (err) {
//             toast.warning(err?.data);
//         }
//     }
// }

const handleError = (error) => {
    // S'assurer que l'erreur provient bien d'Axios
    if (axios.isAxiosError(error)) {
        const err = error.response;
        const errorData = err?.data;

        // Cas 1 : Erreur d'authentification (401)
        // Ce cas est prioritaire pour rediriger l'utilisateur.
        if (err?.status === 401) {
            const message = errorData?.message || "Votre session a expiré. Veuillez vous reconnecter.";
            toast.warning(message);
            // Utilisez la méthode de navigation de votre routeur si possible (par ex. useNavigate de React Router)
            window.history.pushState({}, "LoginPage", "/login");
            return; // Arrêter le traitement ici
        }

        // Cas 2 : Erreurs de validation (généralement 400)
        // Celles-ci contiennent un objet `errors` avec les détails par champ.
        if (errorData?.errors && typeof errorData.errors === 'object') {
            // Afficher chaque erreur de champ spécifique
            for (const key in errorData.errors) {
                toast.warning(errorData.errors[key]);
            }
        } 
        // Cas 3 : Autres erreurs structurées de l'API (404, 409, 500...)
        // Celles-ci ont une propriété `message` mais pas d'objet `errors`.
        else if (errorData?.message) {
            toast.error(errorData.message);
        }
        // Cas 4 : Fallback pour les erreurs réseau ou les formats inattendus
        else {
            toast.error("Une erreur inattendue est survenue. Vérifiez votre connexion ou réessayez plus tard.");
            console.error("Erreur API non gérée:", error); // Garder une trace pour le débogage
        }
    } else {
        // Gérer les erreurs qui ne sont pas des erreurs Axios (ex: erreurs de logique dans le code React)
        toast.error("Une erreur applicative est survenue.");
        console.error("Erreur non-API:", error);
    }
};

export { handleError };


