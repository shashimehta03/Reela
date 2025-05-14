import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isVerified, setIsVerified] = useState(() => {
        return localStorage.getItem('isVerified') === 'true';
    });

    useEffect(() => {
        if (isVerified) {
            localStorage.setItem('isVerified', 'true');
            const timeout = setTimeout(() => {
                setIsVerified(false);
                localStorage.removeItem('isVerified');
                // Consider a more user-friendly notification system than alert
                alert('Session expired. You have been logged out.');
            }, 15 * 60 * 1000); // 15 minutes

            return () => clearTimeout(timeout);
        } else {
            localStorage.removeItem('isVerified');
        }
    }, [isVerified]);

    const login = () => {
        setIsVerified(true);
    };

    const logout = () => {
        setIsVerified(false);
    };

    return (
        <AuthContext.Provider value={{ isVerified, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}; 