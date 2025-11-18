import * as Yup from "yup";

export const albumSchema = Yup.object().shape({
  nomAlbum: Yup.string()
    .required("nom de l'album obligatoire"),
  maisonId: Yup.string()
    .required("maison obligatoire")
});
