import VacancyCard from "@/components/VacancyCard";

import type { components } from "@/types/api";
import MyPagination from "./Pagination";
import { useEffect, useState } from "react";

type Vacancy = components['schemas']['VacancyRead'];

interface VacanciesListProps {
    setCurrentVacancy: React.Dispatch<React.SetStateAction<Vacancy | null>>,
    onClick: (vacancy: Vacancy) => void,
    location: String,
    keyWords: String | null
}
export default function VacanciesList({ setCurrentVacancy, onClick, location, keyWords }: VacanciesListProps) {
    const [vacancies, setVacancies] = useState<Vacancy[]>([])
    const [currentPage, setCurrentPage] = useState<Number>(1)
    const [isLoading, setIsLoading] = useState<Boolean>(true)
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
    });

    useEffect(() => {
        const locationProp = location ? `location=${location}` : "";
        const keyWordsProp = keyWords ? `key_words=${keyWords}` : "";
        fetch(`${import.meta.env.VITE_API_URL}/vacancies?page=${currentPage}&limit=10&${locationProp}&${keyWordsProp}`)
            .then((res) => res.json())
            .then((json) => {
                setVacancies(json.data)
                setCurrentVacancy(json.data[0])
                setPagination(json.pagination)
            })
            .catch((err) => {
                console.warn(err);
            })
            .finally(() => {
                setIsLoading(false)
            });
    }, [currentPage, location, keyWords])

    return (
        isLoading ? (
            <div>Loading...</div>
        ) : (
            vacancies.length === 0 ? (
                <div>
                    <p>The search did not match any jobs. Search suggestions:</p>
                    <ul>
                        <li>Try more general keywords</li>
                        <li>Check your spelling</li>
                        <li>Replace abbreviations with the entire word</li>
                    </ul>

                </div>
            ) : (
                <div className="overflow-y-auto flex flex-col gap-4">
                    {vacancies.map((vacancy: Vacancy, index: number) => (
                        <VacancyCard key={index} vacancy={vacancy} onClick={onClick} />
                    ))}
                    <MyPagination currentPage={currentPage} pagination={pagination} setCurrentPage={setCurrentPage} />
                </div>
            )
        )
    );
}