import React, { createContext, useContext } from 'react';

const RoleContext = createContext(null);
export const RoleProvider = ({ role, children }) => {
    return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};
export const useRole = () => useContext(RoleContext);

