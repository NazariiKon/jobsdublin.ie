import type { components } from "@/types/api";

export async function apply(file: File, id: number) {
    const token = localStorage.getItem("token");
    if (!token)
        return { success: false, error: "Auth error" };

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vacancies/apply/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: result.detail || "Unknown error" };
        }
    } catch (error) {
        console.error("Server error: ", { error });
        return { success: false, error: error || "Unknown error" };
    }
}

type Vacancy = components['schemas']["VacancyCreate"]

export async function createVacancy(data: Vacancy) {
    const token = localStorage.getItem("token");
    if (!token)
        return { success: false, error: "Auth error" };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vacancies/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: result.detail || "Unknown error" };
        }
    } catch (error) {
        console.error("Server error: ", { error });
        return { success: false, error: error || "Unknown error" };
    }
}

export async function deleteVacancy(id: number) {
    const token = localStorage.getItem("token");
    if (!token)
        return { success: false, error: "Auth error" };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vacancies/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: result.detail || "Unknown error" };
        }
    } catch (error) {
        console.error("Server error: ", { error });
        return { success: false, error: error || "Unknown error" };
    }
}

export async function editVacancy(id: number, data: Vacancy) {
    const token = localStorage.getItem("token");
    if (!token)
        return { success: false, error: "Auth error" };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vacancies/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: result.detail || "Unknown error" };
        }
    } catch (error) {
        console.error("Server error: ", { error });
        return { success: false, error: error || "Unknown error" };
    }
}