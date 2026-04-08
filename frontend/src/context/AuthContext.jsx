import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [isLoggedIn, setIsLoggedIn] = useState(!!authToken);

    useEffect(() => {
        if (authToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [authToken]);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
