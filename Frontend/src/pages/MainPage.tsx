import { useEffect, useState } from "react"

type User = {
    id: number,
    email: string
}

export default function MainPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    useEffect(() => {
        const fetchUser = () => {
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_API_URL}/login/users/me`, {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json())
            .then((data) => setCurrentUser(data))
        }   
        fetchUser();
    }, [])

  return (
    <>
    {currentUser != null && (
        <h1>Hello {currentUser.email}</h1>
    )}
    </>
  )
}
