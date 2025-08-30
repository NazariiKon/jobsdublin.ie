import { Navigate } from "react-router-dom";
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
    if (!currentUser) {
        if (requireEmployer)
            return <Navigate to="/regemployers" replace />;
        return <Navigate to="/login" replace />;
    }
    else {
        if (currentUser.authType != "employer")
            return <Navigate to="/regemployers" replace />;
    }

    return children;
}
