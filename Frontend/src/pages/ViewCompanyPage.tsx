import { useLocation, useParams } from "react-router-dom";

export default function ViewCompanyPage() {
    const { id } = useParams();
    const { state } = useLocation();

    return (
        <>
            <p>{state.company.title} ViewCompanyPage</p>
        </>
    )
}