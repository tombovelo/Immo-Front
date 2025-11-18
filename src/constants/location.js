// Format des limites : [[latitude_sud, longitude_ouest], [latitude_nord, longitude_est]]
export const provincesMadagascar = [
  { value: "Antananarivo", label: "Antananarivo", bounds: [[-19.88, 46.55], [-18.4, 48.0]] },
  { value: "Antsiranana", label: "Antsiranana", bounds: [[-14.5, 48.0], [-12.0, 50.5]] },
  { value: "Fianarantsoa", label: "Fianarantsoa", bounds: [[-25.6, 45.0], [-20.8, 48.0]] },
  { value: "Mahajanga", label: "Mahajanga", bounds: [[-18.0, 44.0], [-15.0, 48.0]] },
  { value: "Toamasina", label: "Toamasina", bounds: [[-19.0, 48.0], [-15.5, 50.5]] },
  { value: "Toliara", label: "Toliara", bounds: [[-25.7, 43.2], [-21.0, 47.0]] },
];

// Options pour le formulaire de recherche (avec "Toutes")
export const provinceOptionsRecherche = [
    { value: "", label: "Toutes" },
    ...provincesMadagascar
];

export const regionsMadagascar = [
  { value: 'Alaotra-Mangoro', label: 'Alaotra-Mangoro' },
  { value: 'Amoron\'i Mania', label: 'Amoron\'i Mania' },
  { value: 'Analamanga', label: 'Analamanga' },
  { value: 'Analanjirofo', label: 'Analanjirofo' },
  { value: 'Androy', label: 'Androy' },
  { value: 'Anosy', label: 'Anosy' },
  { value: 'Atsimo-Andrefana', label: 'Atsimo-Andrefana' },
  { value: 'Atsimo-Atsinanana', label: 'Atsimo-Atsinanana' },
  { value: 'Atsinanana', label: 'Atsinanana' },
  { value: 'Betsiboka', label: 'Betsiboka' },
  { value: 'Boeny', label: 'Boeny' },
  { value: 'Bongolava', label: 'Bongolava' },
  { value: 'Diana', label: 'Diana' },
  { value: 'Matsiatra Ambony', label: 'Matsiatra Ambony' },
  { value: 'Ihorombe', label: 'Ihorombe' },
  { value: 'Itasy', label: 'Itasy' },
  { value: 'Melaky', label: 'Melaky' },
  { value: 'Menabe', label: 'Menabe' },
  { value: 'Sava', label: 'Sava' },
  { value: 'Sofia', label: 'Sofia' },
  { value: 'Vakinankaratra', label: 'Vakinankaratra' },
  { value: 'Vatovavy-Fitovinany', label: 'Vatovavy-Fitovinany' },
].sort((a, b) => a.label.localeCompare(b.label));

// Options pour un futur formulaire de recherche (avec "Toutes")
export const regionOptionsRecherche = [
    { value: "", label: "Toutes" },
    ...regionsMadagascar
];






