import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import type { components } from '@/types/api';
import VacanciesList from "@/components/VacanciesList";
import FullVacancyInfo from "@/components/FullVacancyInfo";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";

type User = components['schemas']['UserRead'];
type Vacancy = components['schemas']['VacancyRead'];

export default function MainPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [currentVacancy, setCurrentVacancy] = useState<Vacancy | null>(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setCurrentUser(null)
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
                    setCurrentUser(null)
                    return;
                }

                if (!result.ok) {
                    throw new Error(`Error: ${result.status}`);
                }

                const data = await result.json();
                setCurrentUser(data);
                dispatch(setUser(data));
            }
            catch (error) {
                console.error('Error:', error);
                setCurrentUser(null);
            }
        }
        fetchUser();
    }, [])

    const handleCardClick = (vacancy: Vacancy) => {
        setCurrentVacancy(vacancy)
    }


    return (
        <>
            <div className="w-3/4 grid grid-cols-2 justify-self-center gap-4 mt-4">
                <VacanciesList setCurrentVacancy={setCurrentVacancy} onClick={handleCardClick}></VacanciesList>
                <FullVacancyInfo vacancy={currentVacancy} onClick={() => navigate(`/apply/${currentVacancy?.id}`)}></FullVacancyInfo>
            </div >
        </>
    )
}
