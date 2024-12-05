import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    // State to store user details (initially null)
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext in other components
export const useUser = () => useContext(UserContext);
