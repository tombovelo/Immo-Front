import React from 'react';
import TableRow from '../../atoms/TableRow/TableRow';
import TableCell from '../../atoms/TableCell/TableCell';

/**
 * Récupère une valeur imbriquée dans un objet à l'aide d'un chemin (ex: 'proprietaire.nom').
 * @param {object} obj - L'objet source.
 * @param {string} path - Le chemin vers la propriété.
 * @returns {*} La valeur trouvée ou 'N/A' si non trouvée.
 */
const getNestedValue = (obj, path) => {
    if (!path || typeof path !== 'string') return 'N/A';
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const TableRowCell = ({ item, columns, onRowClick }) => {
    return (
        <TableRow onClick={() => onRowClick && onRowClick(item)}>
            {columns.map((column, index) => (
                <TableCell key={index} className={column.className}>
                    {column.cell
                        ? column.cell(item)
                        : (getNestedValue(item, column.accessor) || 'N/A')
                    }
                </TableCell>
            ))}
        </TableRow>
    );
};


export default TableRowCell;








