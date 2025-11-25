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

// Schéma de validation pour PhotoForm
export const photoSchema = Yup.object().shape({
  albumId: Yup.string()
    .required("L'album est obligatoire"),
  file: Yup.mixed()
    .required("Un fichier est obligatoire")
    .test(
      "fileType",
      "Le format de l'image n'est pas supporté. Veuillez utiliser un des formats suivants : JPEG, PNG, GIF, WebP, SVG, BMP.",
      (value) => !value || (value && SUPPORTED_IMAGE_FORMATS.includes(value.type))
    )
    .test(
      "fileSize",
      "Le fichier est trop volumineux (la taille ne doit pas dépasser 5 Mo)",
      (value) => !value || (value && value.size <= MAX_FILE_SIZE)
    )
});
