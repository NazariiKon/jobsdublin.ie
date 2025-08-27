import { useEffect, useState } from "react"
import type { components } from '@/types/api';
import VacanciesList from "@/components/VacanciesList";
import FullVacancyInfo from "@/components/FullVacancyInfo";
import { useNavigate } from "react-router-dom";
import { clearUser, setUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";

import { isMobile } from "react-device-detect";
import SearchBar from "@/components/Search";

type Vacancy = components['schemas']['VacancyRead'];

export default function MainPage() {
    const [currentVacancy, setCurrentVacancy] = useState<Vacancy | null>(null)
    const [location, setLocation] = useState<String>("Dublin")
    const [keyWords, setKeyWords] = useState<String | null>(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                dispatch(clearUser());
                return { success: false, error: "Auth error" };
            }
            try {
                const result = await fetch(`${import.meta.env.VITE_API_URL}/login/users/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (result.status === 401) {
                    localStorage.removeItem('token');
                    dispatch(clearUser());
                    return;
                }

                if (!result.ok) {
                    throw new Error(`Error: ${result.status}`);
                }

                const data = await result.json();
                dispatch(setUser(data));
            }
            catch (error) {
                console.error('Error:', error);
                dispatch(clearUser());
            }
        }
        fetchUser();
    }, [])

    const handleCardClick = (vacancy: Vacancy) => {
        if (isMobile && currentVacancy != null) {
            navigate(`/viewjob/${currentVacancy.id}`, { state: { currentVacancy } })
        }
        setCurrentVacancy(vacancy)
    }

    return (
        <>
            <div className="w-full p-[2%] md:p-0 md:w-3/4 justify-self-center mt-4">
                <SearchBar setLocation={setLocation} setKeyWords={setKeyWords}></SearchBar>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <VacanciesList location={location} keyWords={keyWords} setCurrentVacancy={setCurrentVacancy} onClick={handleCardClick}></VacanciesList>
                    <div className="hidden md:block">
                        <FullVacancyInfo vacancy={currentVacancy} onClick={() => navigate(`/apply/${currentVacancy?.id}`)}></FullVacancyInfo>
                    </div>
                </div >
            </div>
        </>
    )
}
