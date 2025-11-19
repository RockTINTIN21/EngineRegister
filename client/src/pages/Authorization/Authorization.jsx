import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.jsx';
import clientConfig from '../../clientConfig.js';
function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://${clientConfig.serverIP}/login`, { username, password });
            if (response.data.status === 'success') {
                console.log('Успешно вошли!');
                login({ username });
                navigate('/');
            } else {
                alert('Failed to login');
            }
        } catch (error) {
            alert('Login error');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="Логин" className="form-label">Логин</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Логин"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Введие логин"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Пароль</label>
                        <input
                            type="Пароль"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Войти</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
