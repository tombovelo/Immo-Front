import * as Yup from "yup";

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
    .required("fichier obligatoire"),
  typeTransactionId: Yup.string()
    .required("Type de transaction obligatoire"),
});
