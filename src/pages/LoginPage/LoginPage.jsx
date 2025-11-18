import LoginForm from "../../components/organisms/LoginForm/LoginForm";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}
