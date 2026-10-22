import { useAuth } from '../contexts/AuthenticationContext';
import { isTokenValid } from "../utils/auth";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
    const { token } = useAuth();

    if (!token || !isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />
}

export default Protected;