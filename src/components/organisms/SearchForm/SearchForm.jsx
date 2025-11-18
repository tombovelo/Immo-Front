import React, { useState } from 'react';
import InputField from '../../molecules/InputField/InputField'; // Assurez-vous que le chemin est correct
import Button from '../../atoms/Button/Button'; // Assurez-vous que le chemin est correct
import styles from './SearchForm.module.scss';
import SelectField from '../../molecules/SelectField/SelectField';
import { regionOptionsRecherche } from '../../../constants/location';

const SearchForm = ({ searchParams, onParamsChange, onSearch, transactions }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onParamsChange(prevParams => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            {/* <h3 className={styles.formTitle}>Rechercher une maison</h3> */}
            <h3 className={styles.formTitle}>Rechercher une maison</h3>
            <div className={styles.formRow}>
                <SelectField
                    label="Région"
                    name="ville"
                    options={regionOptionsRecherche}
                    value={searchParams.ville}
                    onChange={handleChange}
                />
                <InputField
                    label="Adresse"
                    name="adresse"
                    type="text"
                    value={searchParams.adresse}
                    onChange={handleChange}
                />
                <InputField
                    label="Prix Min"
                    name="minPrix"
                    type="number"
                    value={searchParams.minPrix}
                    onChange={handleChange}
                />
                <InputField
                    label="Prix Max"
                    name="maxPrix"
                    type="number"
                    value={searchParams.maxPrix}
                    onChange={handleChange}
                />
                <SelectField
                    label="Transaction"
                    name="typeTransactionId"
                    options={transactions}
                    value={searchParams.typeTransactionId}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formRow}>
                <InputField
                    label="Pièces Min"
                    name="minPieces"
                    type="number"
                    value={searchParams.minPieces}
                    onChange={handleChange}
                />
                <InputField
                    label="Pièces Max"
                    name="maxPieces"
                    type="number"
                    value={searchParams.maxPieces}
                    onChange={handleChange}
                />
        
                <InputField
                    label="Latitude"
                    name="latitude"
                    type="number"
                    step="any" // Permet les nombres décimaux
                    value={searchParams.latitude}
                    onChange={handleChange}
                />
                <InputField
                    label="Longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={searchParams.longitude}
                    onChange={handleChange}
                />
                <InputField
                    label="Distance (Km)"
                    name="distanceKm"
                    type="number"
                    value={searchParams.distanceKm}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.buttonRow}>
                <Button type="submit">Rechercher</Button>
            </div>
        </form>
    );
};

export default SearchForm;
