import VacancyCard from "@/components/VacancyCard";
import type { components } from "@/types/api";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type Company = components['schemas']['CompanyRead'];
type Vacancy = components['schemas']['VacancyRead'];

export default function ViewCompanyPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const [company, setCompany] = useState<Company | null>(null)
    const [vacancies, setVacancies] = useState<Vacancy[] | null>(null)
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/companies/${id}`)
            .then(res => res.json())
            .then(json => {
                setCompany(json)
            })
            .catch(err => {
                setError(err || "Uknown problem")
            })
            .finally(() => setLoading(false));

        fetch(`${import.meta.env.VITE_API_URL}/companies/${id}/vacancies`)
            .then(res => res.json())
            .then(json => {
                setVacancies(json)
            })
            .catch(err => {
                setError(err || "Uknown problem")
            })
            .finally(() => setLoading(false));
    }, [])

    if (error) return <div>{error}</div>
    if (loading) return <div>Loading...</div>
    if (!company && !state) return <div>Loading...</div>
    return (
        <main className="container mx-auto max-w-5xl px-4 py-8">
            <section className="mb-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">{company?.title ?? "—"}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center rounded-xl border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                            Share
                        </button>
                        <button className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90">
                            Follow
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-5">
                        <p className="text-xs uppercase text-muted-foreground mb-1">Industry</p>
                        <p className="text-base">{company?.industry ?? "—"}</p>
                    </div>
                </div>
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-5">
                        <p className="text-xs uppercase text-muted-foreground mb-1">Company size</p>
                        <p className="text-base">{company?.size ?? "—"}</p>
                    </div>
                </div>
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-5">
                        <p className="text-xs uppercase text-muted-foreground mb-1">Website</p>
                        <p className="text-base break-all">{company?.website?.replace("https://", "").replace("/", "") ?? "—"}</p>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <article className="lg:col-span-2 rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-3">About</h2>
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                            <p className="italic">{company?.desc ?? "No description provided yet."}</p>
                        </div>
                    </div>
                </article>

                <aside className="space-y-6">
                    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <dl className="space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-sm text-muted-foreground">Phone</dt>
                                    <dd className="text-sm">{company?.phone_number ?? "—"}</dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-sm text-muted-foreground">Email</dt>
                                    <dd className="text-sm">{company?.creator_user?.email ?? "—"}</dd>
                                </div>

                            </dl>
                            {company?.website && (
                                <div className="mt-5">
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        className="w-full inline-block text-center rounded-xl border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Company Details</h3>
                            <dl className="space-y-4">

                                <div className="flex justify-between gap-4">
                                    <dt className="text-sm text-muted-foreground">CEO Name</dt>
                                    <dd className="text-sm">
                                        {company?.creator_user
                                            ? `${company.creator_user.name} ${company.creator_user.surname}`
                                            : "—"}
                                    </dd>
                                </div>

                                <div className="flex items-center gap-4">
                                    {company?.creator_user?.picture ? (
                                        <img
                                            src={company.creator_user.picture}
                                            alt={`${company.creator_user.name} ${company.creator_user.surname}`}
                                            className="w-28 h-28 object-cover border rounded-md"
                                        />
                                    ) : (
                                        <img className="w-28 h-28 object-cover border rounded-md" src="https://www.shutterstock.com/image-vector/blank-avatar-photo-placeholder-flat-600nw-1151124605.jpg" />
                                    )}
                                </div>
                            </dl>
                        </div>
                    </div>

                </aside>
            </section>

            <section className="mt-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Open roles</h2>
                        <div className="flex items-center gap-2">
                            <div className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                                {vacancies?.length ?? 0}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 gap-2 grid">
                        {vacancies && vacancies?.length > 0 ? vacancies?.map((vacancy: Vacancy, index: number) => (
                            <VacancyCard key={index} vacancy={vacancy} />
                        )) : (
                            <p>No vacancies</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}