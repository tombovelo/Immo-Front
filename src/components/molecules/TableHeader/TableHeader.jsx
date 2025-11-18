import React from 'react';
import TableCell from '../../atoms/TableCell/TableCell';
import styles from './TableHeader.module.scss';

const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((header, index) => (
          <TableCell key={index} isHeader={true}>{header}</TableCell>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;



