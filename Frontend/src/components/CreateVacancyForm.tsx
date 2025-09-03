import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { createVacancy, editVacancy } from "@/api/vacancy";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { components } from "@/types/api";

export const locations = [
    "Dublin 1", "Dublin 2", "Dublin 3", "Dublin 4", "Dublin 5", "Dublin 6", "Dublin 6W",
    "Dublin 7", "Dublin 8", "Dublin 9", "Dublin 10", "Dublin 11", "Dublin 12", "Dublin 13",
    "Dublin 14", "Dublin 15", "Dublin 16", "Dublin 17", "Dublin 18", "Dublin 19", "Dublin 20",
    "Dublin 21", "Dublin 22", "Dublin 23", "Dublin 24",
    "Cork", "Galway", "Limerick", "Waterford", "Kilkenny", "Sligo", "Drogheda", "Dundalk", "Wexford"
];

export const periods = ["hour", "week", "month", "year"];

type Vacancy = components["schemas"]["VacancyRead"];

interface CreateVacancyFormProps {
    companyId: number;
    vacancy?: Vacancy | null;
}

export default function CreateVacancyForm({ companyId, vacancy }: CreateVacancyFormProps) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState<string>(
        vacancy?.location && locations.includes(vacancy.location)
            ? vacancy.location
            : ""
    );
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [period, setPeriod] = useState<string>(
        vacancy?.salary_period && periods.includes(vacancy.salary_period)
            ? vacancy.salary_period
            : ""
    );


    const navigate = useNavigate();

    useEffect(() => {
        if (vacancy) {
            setTitle(vacancy.title ?? "");
            setDesc(vacancy.desc ?? "");
            setLocation(vacancy.location ?? "");
            setMinSalary(vacancy.min_salary?.toString() ?? "");
            setMaxSalary(vacancy.max_salary?.toString() ?? "");
            setPeriod(vacancy.salary_period ?? "");
        }
    }, [vacancy]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !desc || !location || !period) {
            alert("Please fill in all required fields");
            return;
        }

        console.log(vacancy?.company_id)
        const data = {
            title,
            desc,
            location,
            min_salary: minSalary ? parseFloat(minSalary) : null,
            max_salary: maxSalary ? parseFloat(maxSalary) : null,
            salary_period: period as "hour" | "week" | "month" | "year",
            company_id: vacancy?.company_id ?? companyId
        };

        if (!vacancy) {
            const result = await createVacancy(data);
            if (result.success) {
                toast("✅ Vacancy Added Successfully!", {
                    description: "Your vacancy has been added. Good luck!",
                    action: { label: "View", onClick: () => console.log("User clicked View") },
                });
                navigate("/employers");
            }
        } else {
            const result = await editVacancy(vacancy.id, data);
            if (result.success) {
                toast("✅ Vacancy Edited Successfully!", {
                    description: "Your vacancy has been edited. Good luck!",
                    action: { label: "View", onClick: () => console.log("User clicked View") },
                });
                navigate("/employers");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-4">
            <form onSubmit={handleFormSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{vacancy ? "Edit your vacancy" : "Create a Job Vacancy"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block mb-2 font-medium">Job Title</label>
                            <Input
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter job title"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Description</label>
                            <Textarea
                                required
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Enter job description"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Location</label>
                            <Select
                                value={location}
                                onValueChange={setLocation}
                                key={vacancy?.id ?? "new"}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                            {loc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-medium">Minimum Salary</label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={minSalary}
                                    onChange={(e) => setMinSalary(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Maximum Salary</label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={maxSalary}
                                    onChange={(e) => setMaxSalary(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Salary Period</label>
                            <Select
                                required
                                value={period}
                                onValueChange={setPeriod}
                                key={`period-${vacancy?.id ?? "new"}`}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {periods.map((loc) => (
                                        <SelectItem key={loc} value={loc}>
                                            {loc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full">{vacancy ? "Update Job" : "Create Job"}</Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
