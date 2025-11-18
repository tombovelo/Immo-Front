import React from 'react';
import TableHeader from '../../molecules/TableHeader/TableHeader';
import TableRowCell from '../../molecules/TableRowCell/TableRowCell'; // NOTE: C'est maintenant un composant de ligne générique
import styles from './Table.module.scss';


// Fonction utilitaire pour accéder aux propriétés imbriquées
const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const Table = ({
  data,
  columns,
  onRowClick,
  noDataMessage = "Aucune donnée à afficher.",
  className, // Ajout de la prop className
  groupBy,
  groupRender
}) => {
  // Extrait les en-têtes pour le composant TableHeader
  const headers = columns.map(col => col.header);

  const renderGroupedRows = () => {
    const groupedData = data.reduce((acc, item) => {
      const groupKey = getNestedValue(item, groupBy) || 'Non assigné';
      (acc[groupKey] = acc[groupKey] || []).push(item);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([groupTitle, items]) => (
      <React.Fragment key={groupTitle}>
        <tr className={styles.groupRow}>
          <td colSpan={headers.length}>
            {groupRender ? groupRender(groupTitle, items) : groupTitle}
          </td>
        </tr>
        {items.map((item) => (
          <TableRowCell key={item.id} item={item} columns={columns} onRowClick={onRowClick} />
        ))}
      </React.Fragment>
    ));
  };

  const renderRows = () => data.map((item) => (
    <TableRowCell key={item.id} item={item} columns={columns} onRowClick={onRowClick} />
  ));

  return (
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={styles.table}>
        <TableHeader columns={headers} />
        <tbody>
          {data && data.length > 0 ? (
            groupBy ? renderGroupedRows() : renderRows()
          ) : (
            <tr>
              <td colSpan={headers.length} className={styles.noData}>
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;


