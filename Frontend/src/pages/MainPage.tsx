import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import type { components } from '@/types/api';
import VacanciesList from "@/components/VacanciesList";

type User = components['schemas']['UserRead'];


export default function MainPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setCurrentUser(null)
                return;
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
            }
            catch (error) {
                console.error('Error:', error);
                setCurrentUser(null);
            }
        }
        fetchUser();
    }, [])

    return (
        <>
            <Navbar user={currentUser} setUser={setCurrentUser}></Navbar>
            <div className="w-3/4 flex justify-self-center">
                <VacanciesList></VacanciesList>
            </div>
        </>
    )
}
