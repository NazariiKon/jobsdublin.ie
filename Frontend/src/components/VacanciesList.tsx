import VacancyCard from "@/components/VacancyCard";
import { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { components } from "@/types/api";

type Vacancy = components['schemas']['VacancyRead'];

interface VacanciesListProps {
    setCurrentVacancy: React.Dispatch<React.SetStateAction<Vacancy | null>>,
    onClick: (vacancy: Vacancy) => void;
}
export default function VacanciesList({ setCurrentVacancy, onClick }: VacanciesListProps) {
    const [vacancies, setVacancies] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
    });
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 5;
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/vacancies?page=${currentPage}&limit=${limit}`)
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
    }, [currentPage])
    const start = Math.max(currentPage - 2, 1);
    const step = currentPage > 3 ? 2 : (4 - currentPage + 1)
    const end = Math.min(currentPage + step, pagination.total_pages);

    const pages = Array.from({ length: end - start + 1 }, (_, i) => i + start);

    return (
        <div className="grid gap-4">
            {
                vacancies.map((vacancy, index) => (
                    <VacancyCard key={index} vacancy={vacancy} onClick={onClick} />
                ))
            }
            <Pagination>
                <PaginationContent>
                    {pagination.has_prev &&
                        <PaginationItem className="cursor-pointer">
                            <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                        </PaginationItem>
                    }

                    {pages.map((page) => (
                        <PaginationItem onClick={() => setCurrentPage(page)} className="cursor-pointer" key={page}>
                            <PaginationLink isActive={currentPage == page}>{page}</PaginationLink>
                        </PaginationItem>
                    ))}
                    {pagination.has_next && pagination.total_pages > 5 &&
                        <>
                            < PaginationItem >
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem className="cursor-pointer">
                                <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                            </PaginationItem>
                        </>
                    }
                </PaginationContent>
            </Pagination>
        </div >
    )
}