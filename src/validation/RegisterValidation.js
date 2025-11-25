import * as Yup from "yup";


// Constante pour la taille maximale du fichier (5 Mo en octets)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Liste des types MIME d'images autorisés pour une maintenance facile
const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",      // Ajout du format WebP
  "image/svg+xml",   // Ajout du format SVG
  "image/bmp",       // Ajout du format BMP
  // Vous pouvez ajouter d'autres types MIME d'images ici
];


export const registerSchema = Yup.object().shape({
  nom: Yup.string().required("nom obligatoire"),
  prenom: Yup.string(),
  telephone: Yup.string()
    .required("téléphone obligatoire")
    .matches(/^(\\+261|0)[0-9]{9}$/, "Numéro invalide (+261XXXXXXXXX ou 0XXXXXXXXX)"),
  file: Yup.mixed()
    .required("image obligatoire")
    .test(
      "fileType",
      "Le format de l'image n'est pas supporté. Veuillez utiliser un des formats suivants : JPEG, PNG, GIF, WebP, SVG, BMP.",
      (value) => !value || (value && SUPPORTED_IMAGE_FORMATS.includes(value.type))
    )
    .test(
      "fileSize",
      "Le fichier est trop volumineux (la taille ne doit pas dépasser 5 Mo)",
      (value) => !value || (value && value.size <= MAX_FILE_SIZE)
    ),
  utilisateur: Yup.object().shape({
    email: Yup.string()
      .required("Email obligatoire")
      .email("L'email doit être valide"),
    password: Yup.string().required("Le mot de passe est obligatoire"),
  }),
});
