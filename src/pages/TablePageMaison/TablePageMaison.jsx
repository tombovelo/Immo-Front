import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import IconButton from '../../components/atoms/IconButton/IconButton';
import rowStyles from '../../components/molecules/TableRowCell/TableRowCell.module.scss';
import styles from './TablePageMaison.module.scss';
import { toast } from 'react-toastify';
import Table from '../../components/organisms/Table/Table';
import {getMyHouseAPI, deleteHouseAPI} from '../../services/MaisonService';
import { handleError } from '../../helpers/ErrorHandler'; // Assurez-vous que ce helper est bien configuré
import LoadingSpinner from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const TablePageMaisons = () => {

    const [maisons, setMaisons] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaisons = async () => {
            try {
                const data = await getMyHouseAPI();
                setMaisons(data);
            } catch (error) {
                handleError(error); // Vous pouvez toujours utiliser votre helper en plus
            } finally {
                setLoading(false);
            }
        };
        fetchMaisons();
    }, []);


    const handleEditMaison = useCallback((maisonId) => {
        navigate(`/proprietaire/maisons/edit/${maisonId}`);
    }, []);

    const handleDeleteMaison = useCallback(async (maisonId) => {
        try {
            await deleteHouseAPI(maisonId);
            setMaisons(currentMaisons => currentMaisons.filter(maison => maison.id !== maisonId));
            toast.success(`Maison #${maisonId} supprimée avec succès.`);
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    }, []);

    const handleDetailsMaison = useCallback((maisonId) => {
        navigate(`/proprietaire/maisons/${maisonId}`);
    }, []);

    const columns = useMemo(() => [
        { header: 'ID', accessor: 'id' },
        {
            header: 'Photo',
            cell: (maison) => (
                maison.cloudinaryUrl ? (
                    <img
                        src={maison.cloudinaryUrl}
                        alt={`Profil de ${maison.nom}`}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : 'N/A'
            )
        },
        { header: 'Adresse', accessor: 'adresse' },
        {header:'prix',accessor:'prix'},
        {header:'nombrePieces',accessor:'nombrePieces'},
        { header: 'Region', accessor: 'ville' },
        {
            header: 'Visible',
            cell: (maison) => {
                const isVisble = maison.visible;
                const badgeClasses = `${styles.statusBadge} ${isVisble ? styles.visible : styles.notVisible}`;
                return (
                    <div className={badgeClasses}>
                        {isVisble ? 'Oui' : 'Non'}
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            cell: (maison) => (
                <div className={rowStyles.actionButtons}>
                    <IconButton icon={FaEdit} onClick={(e) => { e.stopPropagation(); handleEditMaison(maison.id); }} label="Modifier" />
                    <IconButton className={rowStyles.deleteButton} icon={FaTrashAlt} onClick={(e) => { e.stopPropagation(); handleDeleteMaison(maison.id); }} label="Supprimer" />
                    <IconButton icon={FaInfoCircle} onClick={(e) => { e.stopPropagation(); handleDetailsMaison(maison.id); }} label="Gerer Maison" />
                </div>
            ),
            className: rowStyles.actionsCell
        }
    ], [handleEditMaison, handleDeleteMaison, handleDetailsMaison]); // Les colonnes dépendent de ces fonctions

    const handleRowClick = useCallback((maison) => {
        handleDetailsMaison(maison.id);
    }, [handleDetailsMaison]);

    // Ajoute une propriété `proprietaireFullName` pour faciliter le regroupement.
    const processedData = useMemo(() => maisons.map(m => ({
        ...m,
        proprietaireFullName: m.proprietaire ? `${m.proprietaire.nom} ${m.proprietaire.prenom || ''}`.trim() : 'Non assigné'
    })), [maisons]);

    if (loading) {
        return <LoadingSpinner message='Chargement des maisons...'/>;
    }

    return (
        <div className={styles.tablePageMaisonsContainer}>
            <div className={styles.headerSection}>
                <h2 className={styles.pageTitle}>Liste des Maisons</h2>
                <button className={styles.addButton} onClick={() => navigate('/proprietaire/maison')}>Ajouter maison</button>
            </div>
            <Table
                className={styles.customTable}
                data={processedData}
                columns={columns}
                onRowClick={handleRowClick}
                noDataMessage="Aucune maison à afficher."
                groupBy={null}
            />
        </div>
    );
};

export default TablePageMaisons;
