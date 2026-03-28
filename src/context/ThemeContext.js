import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext({
    currentTheme: 'default',
    setTheme: () => { }
});
export const useTheme = () => useContext(ThemeContext);
export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('minerals');
    useEffect(() => {
        document.body.className = `theme-${currentTheme}`;
    }, [currentTheme]);
    return (_jsx(ThemeContext.Provider, { value: { currentTheme, setTheme: setCurrentTheme }, children: children }));
};
