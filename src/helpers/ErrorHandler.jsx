import axios from "axios"
import { toast } from "react-toastify";

export const handleError = (error) => {
    if (axios.isAxiosError(error)) {
        var err = error.response;
        if (Array.isArray(err?.data.errors)) {
            for (let val of err.data.errors) {
                toast.warning(val.description)
            }
        } else if (typeof err?.data.errors === 'object') {
            for (let key in err.data.errors) {
                const message = err.data.errors[key];
                toast.warning(typeof message === "string" ? message : message[0]);
            }
        } else if (err?.data) {
            toast.warning(err.data)
        } else if(err?.status == 401) {
            toast.warning("Veuillez vous connecter");
            window.history.pushState({}, "LoginPage", "/login");
        } else if (err) {
            toast.warning(err?.data);
        }
    }
}

