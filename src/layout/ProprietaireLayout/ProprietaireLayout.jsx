import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/organisms/Navbar/Navbar';
import Footer from '../../components/organisms/Footer/Footer';
import styles from './ProprietaireLayout.module.scss';
import { RoleProvider } from '../../context/RoleContext';

const ProprietaireLayout = () => {
  return (
    <RoleProvider role="proprietaire">
      <div className={styles.mainLayout}>
        <Navbar />
        <main className={styles.content}>
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </RoleProvider>
  );
};

export default ProprietaireLayout;