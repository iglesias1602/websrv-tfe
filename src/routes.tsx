import { Navigate, Route, Routes } from 'react-router-dom';
import React, { ReactElement } from 'react';
import DashboardLayout from '@/layouts/dashboard';
import LogoOnlyLayout from '@/layouts/LogoOnlyLayout';
import DashboardApp from '@/pages/DashboardApp';
import User from '@/pages/User';
import Labs from '@/pages/Labs';
import NotFound from '@/pages/Page404';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { AuthProvider, useAuth } from '@/components/authentication/login/AuthContext'; // Import AuthProvider

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
    const { session } = useAuth();
    return session ? element : <Navigate to="/login" />;
};

export const Router = (): ReactElement => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout />} />}>
                    <Route path="app" element={<DashboardApp />} />
                    <Route path="" element={<Navigate to="/dashboard/app" replace />} />
                    <Route path="user" element={<User />} />
                    <Route path="labs" element={<Labs />} />

                </Route>
                <Route path="/" element={<LogoOnlyLayout />}>
                    <Route path="404" element={<NotFound />} />
                    <Route path="unauthorized" element={<UnauthorizedPage />} />
                    <Route path="" element={<Navigate to="/dashboard/app" />} />
                    <Route path="*" element={<Navigate to="/404" />} />
                </Route>
                <Route path="/login" element={<LogoOnlyLayout />}>
                    {/* Assuming there's a login component within the LogoOnlyLayout */}
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default Router;
