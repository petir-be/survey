import { useAuth } from "../Context/useAuth";
const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />; // Or a better loading component
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
