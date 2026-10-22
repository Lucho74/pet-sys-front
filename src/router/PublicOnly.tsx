import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthenticationContext";
import { isTokenValid } from "../utils/auth";


const PublicOnly = () => {
    const { token } = useAuth();

    if (token && isTokenValid(token)) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />
}

export default PublicOnly;