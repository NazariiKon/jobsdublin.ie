import FullVacancyInfo from "@/components/FullVacancyInfo";
import type { components } from "@/types/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
type Vacancy = components['schemas']['VacancyRead'];


export default function ViewJobPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<Boolean>(true)
    const { state } = useLocation();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const { id } = useParams();

    useEffect(() => {
        if (!state?.currentVacancy) {
            fetch(`${import.meta.env.VITE_API_URL}/vacancies/${id}`)
                .then(res => res.json())
                .then(json => {
                    setVacancy(json);
                })
                .catch(err => console.warn(err))
                .finally(() => setIsLoading(false));
        } else {
            setVacancy(state.currentVacancy);
            setIsLoading(false);
        }
    }, [id, state]);

    if (isLoading) return <div>Loading...</div>
    return (
        <FullVacancyInfo vacancy={vacancy} onClick={() => navigate(`/apply/${vacancy?.id}`)} />
    )
}