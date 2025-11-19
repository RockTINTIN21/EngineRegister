import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Проверяем наличие пользователя в куки при загрузке компонента
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userFromCookie = Cookies.get('user');
        if (userFromCookie) {
            try {
                const parsedUser = JSON.parse(userFromCookie);
                setUser(parsedUser);
            } catch (error) {
                console.error('Ошибка при парсинге данных пользователя из куки:', error);
                Cookies.remove('user');
            }
        }
        setLoading(false); // Устанавливаем загрузку в false после инициализации
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Или какой-то индикатор загрузки
    }

    const login = (user) => {
        setUser(user);
        Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Сохраняем пользователя в куки на 7 дней
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('user'); // Удаляем куки при выходе
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
