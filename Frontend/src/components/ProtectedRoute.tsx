import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { JSX } from "react";

type ProtectedRouteProps = {
    children: JSX.Element;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
