import * as Yup from "yup";

// Schéma de validation pour PhotoForm
export const photoSchema = Yup.object().shape({
  albumId: Yup.string()
    .required("album obligatoire"), // obligatoire
  file: Yup.mixed()
    .required("fichier obligatoire") // obligatoire
    .test(
      "fileType",
      "Le fichier doit être une image",
      (value) => !value || (value && ["image/jpeg", "image/png", "image/gif"].includes(value.type))
    )
});
