import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useState } from "react";
import { createVacancy } from "@/api/vacancy";

export const locations = [
    "Dublin 1", "Dublin 2", "Dublin 3", "Dublin 4", "Dublin 5", "Dublin 6", "Dublin 6W",
    "Dublin 7", "Dublin 8", "Dublin 9", "Dublin 10", "Dublin 11", "Dublin 12", "Dublin 13",
    "Dublin 14", "Dublin 15", "Dublin 16", "Dublin 17", "Dublin 18", "Dublin 19", "Dublin 20",
    "Dublin 21", "Dublin 22", "Dublin 23", "Dublin 24",
    "Cork", "Galway", "Limerick", "Waterford", "Kilkenny", "Sligo", "Drogheda", "Dundalk", "Wexford"
];
interface CreateVacancyFormProps {
    companyId: number
}
export default function CreateVacancyForm({ companyId }: CreateVacancyFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descInputRef = useRef<HTMLTextAreaElement | null>(null);
    const [location, setLocation] = useState<string>("");
    const minSalInputRef = useRef<HTMLInputElement | null>(null);
    const maxSalInputRef = useRef<HTMLInputElement | null>(null);
    const [period, setPeriod] = useState<string>("");

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formRef.current?.checkValidity()) {
            formRef.current?.reportValidity();
            return;
        }

        if (
            !titleInputRef.current?.value ||
            !descInputRef.current?.value ||
            !location ||
            !period
        ) {
            alert("Please fill in all required fields");
            return;
        }

        const data = {
            title: titleInputRef.current.value,
            desc: descInputRef.current.value,
            location,
            min_salary: minSalInputRef.current?.value
                ? parseFloat(minSalInputRef.current.value)
                : null,
            max_salary: maxSalInputRef.current?.value
                ? parseFloat(maxSalInputRef.current.value)
                : null,
            salary_period: period as "hour" | "week" | "month" | "year",
            company_id: companyId
        };

        createVacancy(data);
    };


    return (
        <div className="max-w-3xl mx-auto mt-4">
            <form ref={formRef} onSubmit={handleFormSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Create a Job Vacancy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block mb-2 font-medium">Job Title</label>
                            <Input required ref={titleInputRef} placeholder="Enter job title" />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Description</label>
                            <Textarea required ref={descInputRef} placeholder="Enter job description" />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Location</label>
                            <Select required value={location} onValueChange={setLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        locations.map((location: string) => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-medium">Minimum Salary</label>
                                <Input required ref={minSalInputRef} type="number" step="0.01" placeholder="0" />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Maximum Salary</label>
                                <Input required ref={maxSalInputRef} type="number" step="0.01" placeholder="0" />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Salary Period</label>
                            <Select required value={period} onValueChange={setPeriod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hour">Hour</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                    <SelectItem value="month">Month</SelectItem>
                                    <SelectItem value="year">Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full">Create Job</Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}