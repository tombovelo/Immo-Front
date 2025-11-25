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

export const maisonSchema = Yup.object().shape({
  ville: Yup.string()
    .required("Province obligatoire"),
  nombrePieces: Yup.string()
    .required("Nombre de pièces obligatoire"),
  prix: Yup.string()
    .required("Prix obligatoire"),
  latitude: Yup.string()
    .required("Latitude obligatoire"),
  longitude: Yup.string()
    .required("Longitude obligatoire"),
  file: Yup.mixed()
    .required("fichier obligatoire")
    .test(
      "fileType",
      "Le format non supporté, utilise : JPEG, PNG, GIF, WebP, SVG, BMP.",
      (value) => !value || (value && SUPPORTED_IMAGE_FORMATS.includes(value.type))
    )
    .test(
      "fileSize",
      "la taille ne doit pas dépasser 5 Mo",
      (value) => !value || (value && value.size <= MAX_FILE_SIZE)
    ),
  typeTransactionId: Yup.string()
    .required("Type de transaction obligatoire"),
});
