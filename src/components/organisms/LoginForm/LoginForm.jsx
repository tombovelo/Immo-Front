import { useContext, useState } from "react";
import InputField from "../../molecules/InputField/InputField";
import Button from "../../atoms/Button/Button";
import styles from "./LoginForm.module.scss";
import { useAuth } from "../../../context/userAuth";
import { Link } from "react-router-dom";

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("everaldo@1234");
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // La fonction loginUser du contexte gère la navigation en cas de succès
    // et l'affichage des erreurs via des toasts.
    await loginUser(email, password);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Connexion</h2>

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">Se connecter</Button>
      <p className={styles.loginPrompt}>
        Vous n'avez pas encore de compte ? <Link to="/register" className={styles.loginLink}>S'inscrire</Link>
      </p>
    </form>
  );
}
