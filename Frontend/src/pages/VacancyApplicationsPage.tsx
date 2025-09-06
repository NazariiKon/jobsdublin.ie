import { changeUserApplicationStatus, getUsersApplicationsByVacancy } from "@/api/vacancy";
import { Button } from "@/components/ui/button";
import type { components } from "@/types/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type UserVacancy = components["schemas"]["UserVacancy"]

export default function VacancyApplicationsPage() {
    const { id } = useParams<{ id: string }>();
    const [applications, setApplications] = useState<UserVacancy[]>([])
    const [selectedApp, setSelectedApp] = useState<UserVacancy | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        const fetchApplications = async () => {
            if (id) {
                const res = await getUsersApplicationsByVacancy(id)
                if (res.success) {
                    setApplications(res.result)
                    setSelectedApp(res.result[0])
                }
                else setError(res.error)
            }
            setIsLoading(false)
        }
        fetchApplications()
    }, [id])

    const onClick = async (app: UserVacancy, status: "REJECTED" | "APPROVED") => {
        await changeUserApplicationStatus(app.id, status)
        setApplications(prev =>
            prev.map(a =>
                a.id === app.id
                    ? { ...a, status: status === "APPROVED" ? ["Approved"] : "Rejected" }
                    : a
            )
        )
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="lg:w-1/3 min-w-100 w-full overflow-y-auto border-r p-4 space-y-2">
                {applications.map(app => (
                    <div
                        key={app.id}
                        className={`p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100 ${selectedApp?.id === app.id ? "ring-2 ring-blue-500" : ""} ${app.status == "Rejected" ? "ring-2 ring-red-500" : ""}`}
                        onClick={() => setSelectedApp(app)}
                    >
                        <div className="flex items-center">
                            <img
                                src={app.user.picture || "https://www.shutterstock.com/image-vector/blank-avatar-photo-placeholder-flat-600nw-1151124605.jpg"}
                                alt={`${app.user.name || "User"} ${app.user.surname || ""}`}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{app.user.name || "No name"} {app.user.surname || ""}</p>
                                <p className="text-gray-500 text-sm">{app.user.email}</p>
                                <p className="text-gray-400 text-xs">{new Date(app.created_at).toLocaleString()}</p>
                            </div>
                            {app.status != "Rejected" ? (
                                <Button onClick={() => onClick(app, "REJECTED")} variant={"destructive"}>Reject</Button>
                            ) : (
                                <Button onClick={() => onClick(app, "APPROVED")}>Approve</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="md:flex-1 w-full p-4">
                {selectedApp ? (
                    <>
                        <iframe
                            src={`${import.meta.env.VITE_API_URL}/vacancies/${selectedApp.cv_path}`}
                            className="w-full h-[70vh] md:h-full border rounded"
                            title="CV"
                        ></iframe>
                        <a
                            href={`${import.meta.env.VITE_API_URL}/vacancies/${selectedApp.cv_path}`}
                            download
                            className="mt-2 inline-block text-blue-600 hover:underline"
                        >
                            Download CV
                        </a>
                    </>
                ) : (
                    <p className="text-gray-400">Select a candidate to view CV</p>
                )}
            </div>
        </div>
    )
}
