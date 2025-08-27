import FullVacancyInfo from "@/components/FullVacancyInfo";
import { useLocation, useNavigate, useParams } from "react-router-dom";


export default function ViewJobPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    return (
        <FullVacancyInfo vacancy={state.currentVacancy} onClick={() => navigate(`/apply/${state?.id}`)}></FullVacancyInfo>
    )
}