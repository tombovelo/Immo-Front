import React from 'react';
import styles from './TableCell.module.scss';

const TableCell = ({ children, isHeader = false, className = '' }) => {
  const Tag = isHeader ? 'th' : 'td';
  return <Tag className={`${styles.cell} ${className}`}>{children}</Tag>;
};

export default TableCell;

