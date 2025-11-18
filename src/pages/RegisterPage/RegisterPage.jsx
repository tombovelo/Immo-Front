import RegisterForm from "../../components/organisms/RegisterForm/RegisterForm";
import styles from './RegisterPage.module.scss'

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
}