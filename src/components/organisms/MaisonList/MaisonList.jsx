import React, { useEffect, useState, useRef } from "react";
import MaisonCard from "../../molecules/MaisonCard/MaisonCard";
import styles from "./MaisonList.module.scss";
import SearchForm from "../searchForm/searchForm";
import MaisonListMap from "../MaisonListMap/MaisonListMap";
import { FaList, FaMap } from "react-icons/fa";
import { searchHouseAPI } from "../../../services/MaisonService";
import { getTransactionAPI } from "../../../services/TypeTransactionService";
import regionsGeoJSON from "../../../constants/region-mada.geojson.json";
import LoadingSpinner from "../../molecules/LoadingSpinner/LoadingSpinner";

export default function MaisonList() {
  const [maisons, setMaisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("map");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [searchParams, setSearchParams] = useState({
    adresse: '',
    ville: '',
    minPrix: '',
    maxPrix: '',
    typeTransactionId: '',
    minPieces: '',
    maxPieces: '',
    proprietaireId: '',
    latitude: '',
    longitude: '',
    distanceKm: '',
  });

  // 1. On crée une "ancre" (ref) pour la section des résultats
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError("");
      try {
        const [maisonsData, transactionsData] = await Promise.all([
          searchHouseAPI(searchParams),
          getTransactionAPI()
        ]);

        setMaisons(maisonsData || []);
        setTransactions([
          { value: '', label: 'Tout' },
          ...transactionsData.map((option) => ({
            value: option.id,
            label: option.nom,
          })),
        ]);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const normalizeString = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/['\- ]/g, "");
  };

  useEffect(() => {
    if (searchParams.ville) {
      const regionFeature = regionsGeoJSON.features.find(
        (feature) => normalizeString(feature.properties.shapeName) === normalizeString(searchParams.ville)
      );
      setSelectedRegion(regionFeature);
    } else {
      setSelectedRegion(null);
    }
  }, [searchParams.ville]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await searchHouseAPI(searchParams);
      setMaisons(data || []);
      // 3. On demande au navigateur de défiler jusqu'à l'ancre
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Impossible de charger les maisons");
    } finally {
      setLoading(false);
    }
  };

  const handlePositionUpdate = (latlng) => {
    setSearchParams(prev => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6),
    }));
  };

  // Centralise le changement de vue et le scroll
  const handleViewChange = (mode) => {
    setViewMode(mode);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <React.Fragment>
       <SearchForm searchParams={searchParams} onParamsChange={setSearchParams} onSearch={handleSearch} transactions={transactions} />
      
      {/* 2. On attache l'ancre au conteneur des résultats */}
      <div className={styles.viewToggle} ref={resultsRef}>
        <button onClick={() => handleViewChange('list')} className={viewMode === 'list' ? styles.active : ''}>
          <FaList /> Liste
        </button>
        <button onClick={() => handleViewChange('map')} className={viewMode === 'map' ? styles.active : ''}>
          <FaMap /> Carte
        </button>
      </div>

      {loading && <LoadingSpinner message="Chargement des maisons..."/>}
      {error && <div className={styles.infoError}>{error}</div>}
      
      {!loading && !error && (
        viewMode === 'list' ? (
          maisons.length > 0 ? (
            <div className={styles.grid}>
              {maisons.map((m) => (<MaisonCard key={m.id} maison={m} />))}
            </div>
          ) : (
            <div className={styles.info}>Aucune maison trouvée.</div>
          )
        ) : (
          <MaisonListMap
            maisons={maisons}
            onMapClick={handlePositionUpdate}
            onLocationFound={handlePositionUpdate}
            searchMarkerPosition={searchParams.latitude && searchParams.longitude ? [parseFloat(searchParams.latitude), parseFloat(searchParams.longitude)] : null}
            distanceKm={searchParams.distanceKm}
            regionFeature={selectedRegion}
          />
        )
      )}
    </React.Fragment>
  );
}
