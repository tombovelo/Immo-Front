import React from 'react';
import styles from './TableRow.module.scss';

const TableRow = ({ children, onClick }) => {
  return (
    <tr className={styles.row} onClick={onClick}>
      {children}
    </tr>
  );
};

export default TableRow;

