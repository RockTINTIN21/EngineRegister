import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import LoginPage from './pages/Authorization/Authorization.jsx';
import Menu from "./pages/Menu.jsx";
import Header from "./layouts/Header/Header.jsx";
import AggregateJournal from "./pages/AggregateJournal/AggregateJournal.jsx";
import EnginePassport from "./pages/EnginePassport/EnginePassport.jsx";
import EditDataBase from "./pages/EditDataBase/EditDataBase.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function AppWrapper() {
    return (
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    );
}

function App() {
    const location = useLocation(); // Получаем текущий путь

    return (
        <>
            {location.pathname !== '/login' && <Header />}
            <div className="container pt-3 pt-md-4">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<PrivateRoute><Menu /></PrivateRoute>} />
                    <Route path="/AggregateJournal" element={<PrivateRoute><AggregateJournal /></PrivateRoute>} />
                    <Route path="/AggregateJournal/EnginePassport" element={<PrivateRoute><EnginePassport /></PrivateRoute>} />
                    <Route path="/AggregateJournal/EditDataBase" element={<PrivateRoute><EditDataBase /></PrivateRoute>} />
                    <Route path="/AggregateJournal/EnginePassport/:engineId" element={<PrivateRoute><EnginePassport /></PrivateRoute>} />
                </Routes>
            </div>
        </>
    );
}

export default AppWrapper;
