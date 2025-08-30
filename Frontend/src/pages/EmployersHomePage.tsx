import { Button } from "@/components/ui/button";
import VacancyCard from "@/components/VacancyCard";
import type { RootState } from "@/store/store";
import type { components } from "@/types/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

type Vacancy = components['schemas']['VacancyRead'];
type User = components['schemas']['UserRead'];

export default function EmployersHomePage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errors, setErrors] = useState<string | null>("")
    const [currentVacancy, setCurrentVacancy] = useState<Vacancy | null>(null)
    const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/regemployers");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/companies/${user.id}/vacancies`)
            .then(async (res) => {
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || "Failed to fetch vacancies");
                }
                return res.json();
            })
            .then((json) => {
                if (Array.isArray(json)) {
                    setVacancies(json);
                } else {
                    setVacancies([]);
                    setErrors("Vacancies data is not an array");
                }
            })
            .catch((err) => setErrors(err.message))
            .finally(() => setIsLoading(false));
    }, [user]);


    const handleCreateBtnClick = () => {

    }

    const handleCardClick = (vacancy: Vacancy) => {
        if (isMobile && currentVacancy != null) {
            navigate(`/viewjob/${currentVacancy.id}`, { state: { currentVacancy } })
        }
        setCurrentVacancy(vacancy)
    }

    return (
        isLoading ? (
            <p>Loading...</p>
        ) : (
            errors ? (
                <p>{errors}</p>
            ) : (
                <div className="w-2/3 mt-2 justify-self-center grid gap-6" >
                    <Button onClick={handleCreateBtnClick}>Create a vacancion</Button>
                    <p className="text-4xl">Your vacancies:</p>
                    {vacancies.map((vacancy: Vacancy, index: number) => (
                        <VacancyCard key={index} vacancy={vacancy} onClick={handleCardClick} />
                    ))
                    }
                </div >)

        )

    )
}
