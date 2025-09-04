import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { JSX } from "react";
import type { components } from "@/types/api";

type User = components['schemas']['UserRead'];

type ProtectedRouteProps = {
    children: JSX.Element,
    requireEmployer?: boolean;
};

export default function ProtectedRoute({ children, requireEmployer }: ProtectedRouteProps) {
    const currentUser = useSelector((state: RootState) => state.user.currentUser) as User | null;
    const location = useLocation();

    if (!currentUser) {
        return (
            <Navigate
                to={requireEmployer ? "/regemployers" : "/login"}
                replace
                state={{ from: location }}
            />
        );
    }

    if (requireEmployer && currentUser.authType !== "employer") {
        return <Navigate to="/regemployers" replace state={{ from: location }} />;
    }

    return children;
}

