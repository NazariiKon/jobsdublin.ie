import type { components } from "@/types/api";

export async function getCompanyById(id: string) {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json();

    if (response.ok) {
        return { success: true, result: result };
    } else {
        return { success: false, error: result.detail || "Unknown error" };
    }
}

type Company = components["schemas"]["CompanyCreate"]
export async function editCompany(id: number, data: Company) {
    const token = localStorage.getItem("token");
    if (!token)
        return { success: false, error: "Auth error" };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${id}`, {
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