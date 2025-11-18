import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import { updateMyProfile } from "../services/ProprietaireService";

const UserContext = createContext();

export const UserProvider = ({ children }) => { // ⚠️ `children` (minuscule)

  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (formData) => {
    try {
      const res = await registerAPI(formData);
      if (res) {
        const userObj = res?.userProfile;
        const token = res?.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));
        // Mettre à jour l'en-tête Axios immédiatement pour eviter les unathorized 403
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
        setUser(userObj);
        toast.success("Inscription réussie !");
        navigate("/proprietaire/maisons/table");
      }
    } catch (e) {
      toast.warning("Une erreur est survenue");
    }
  };

  const updateUser = async (formData) => {
    try {
      const res = await updateMyProfile(formData);
      if (res) {
        const userObj = res?.userProfile;
        const token = res?.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));
        // Mettre à jour l'en-tête Axios immédiatement pour eviter les unathorized 403
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
        setUser(userObj);
        toast.success("✅ Profil mis à jour avec succès !");
        navigate("/proprietaire/profile");
      }
    } catch (e) {
      toast.warning("Une erreur est survenue");
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await loginAPI(email, password);
      if (res) {
        const token = res?.token;
        const userObj = res?.userProfile;
        localStorage.setItem("token", res?.token);
        localStorage.setItem("user", JSON.stringify(userObj));
        // Mettre à jour l'en-tête Axios immédiatement pour eviter les unathorized 403
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
        setUser(userObj);
        toast.success("Connexion réussie !");
        navigate("/proprietaire/maisons/table");
      }
    } catch (e) {
      toast.warning("Une erreur est survenue");
    }
  };

  const isLoggedIn = () => {
    return !!user || !!localStorage.getItem("token");
  };

  const logout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    // Supprimer l'en-tête pour les futures requêtes non authentifiées
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser, updateUser }} // ⚠️ accolades `{}` au lieu de `()`
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
