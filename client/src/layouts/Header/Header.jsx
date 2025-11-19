import styles from './Header.module.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx'; // Импортируем useAuth

import exit from "../../assets/icons/exit.svg";

function Header() {
    const [clock, setClock] = useState('');
    const { logout } = useAuth(); // Достаем функцию выхода из контекста
    const navigate = useNavigate(); // Для перенаправления на страницу логина
    const login = 'Admin';

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            setClock(`${day}.${month}.${year} | ${hours}:${minutes}`);
        };
        updateClock();
        const timerId = setInterval(updateClock, 1000);
        return () => clearInterval(timerId);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение ссылки
        logout(); // Вызываем функцию logout из контекста
        navigate('/login'); // Перенаправляем на страницу логина
    };

    return (
        <header className='col-12 pt-1 pb-1 container-fluid bg-deep-blue'>
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div className="pe-2">{clock}</div>
                    <div className="text-end">Добро пожаловать, {login}.
                        <a href="#" className='ps-3' onClick={handleLogout}>
                            Выйти
                            <img src={exit} className='ps-1' height="20px" alt="Выход"/>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
