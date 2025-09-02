import { deleteVacancy } from "@/api/vacancy";
import { Button } from "@/components/ui/button";
import VacancyCard from "@/components/VacancyCard";
import type { RootState } from "@/store/store";
import type { components } from "@/types/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Vacancy = components['schemas']['VacancyRead'];
type User = components['schemas']['UserRead'];
type Company = components['schemas']['CompanyRead'];

export default function EmployersHomePage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([])
    const [company, setCompany] = useState<Company | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<string | null>("")
    const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/regemployers");
            return;
        }
        setIsLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/companies/user/${user.id}/vacancies`)
            .then(async (res) => {
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || "Failed to fetch vacancies");
                }
                return res.json();
            })
            .then((json) => {
                console.log(json)
                if (json.vacancies)
                    setVacancies(json.vacancies);
                else
                    setErrors("You don't have any open vacancies yet")
                setCompany(json.company);
            })
            .catch((err) => setErrors(err.message))
            .finally(() => setIsLoading(false));
    }, [user]);

    const onDeleteClick = async (vacancy: Vacancy) => {
        const id = Number(vacancy.id)
        const result = await deleteVacancy(id)
        if (result.success) {
            setVacancies(prev => prev.filter(v => v.id !== id));
            toast("✅ Vacancy Deleted Successfully!", {
                description: "Your vacancy has been deleted. Good luck!",
                action: {
                    label: "View",
                    onClick: () => console.log("User clicked View"),
                },
            });
        }
    }

    return (
        isLoading ? (
            <p>Loading...</p>
        ) : (
            < div className="w-full md:w-1/2 p-3 mt-2 justify-self-center grid gap-6" >
                <Button onClick={() => navigate(`/createvacancy/${company?.id}`)}>Create a vacancion</Button>
                <p className="text-4xl">Your vacancies:</p>
                {errors ? (
                    <p>{errors}</p>
                ) : (
                    vacancies.map((vacancy: Vacancy, index: number) => (
                        <VacancyCard key={index} vacancy={vacancy} isCreator={true} onDeleteClick={onDeleteClick} />
                    ))
                )}
            </div >


        )

    )
}
