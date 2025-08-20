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