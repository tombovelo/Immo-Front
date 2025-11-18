import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  nom: Yup.string().required("nom obligatoire"),
  prenom: Yup.string(),
  telephone: Yup.string()
    .required("téléphone obligatoire")
    .matches(/^(\\+261|0)[0-9]{9}$/, "Numéro invalide (+261XXXXXXXXX ou 0XXXXXXXXX)"),
  utilisateur: Yup.object().shape({
    email: Yup.string()
      .required("Email obligatoire")
      .email("L'email doit être valide"),
    password: Yup.string().required("Le mot de passe est obligatoire"),
  }),
});
