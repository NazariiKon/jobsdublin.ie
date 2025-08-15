import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { components } from '@/types/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Briefcase, MapPin, HandCoins } from "lucide-react";
import { Button } from "./ui/button";

type Vacancy = components['schemas']['VacancyRead'];

interface Props {
    vacancy: Vacancy,
    onClick: (vacancy: Vacancy) => void;
}

dayjs.extend(relativeTime);

export default function VacancyCard({ vacancy, onClick }: Props) {
    const daysAgo = dayjs().diff(dayjs(vacancy.creation_date), 'day');

    return (
        <Card className="cursor-pointer group" onClick={() => onClick(vacancy)}>
            <CardHeader>
                <CardTitle className="font-bold text-xl group-hover:underline">{vacancy.title}</CardTitle>
                <CardDescription className="flex gap-5">
                    <div className="flex items-center gap-1">
                        <Briefcase className="size-3 mt-1 text-black" />
                        {vacancy.company_name}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="size-3 mt-1 text-black" />
                        {vacancy.location}
                    </div>
                </CardDescription>
                <CardDescription className="flex gap-5">
                    <div className="flex items-center gap-1">
                        <HandCoins className="size-3 text-black" />
                        €{vacancy.min_salary?.toLocaleString()} - €{vacancy.max_salary?.toLocaleString()} per {vacancy.salary_period}
                    </div>
                </CardDescription>

                <CardAction><Button>+</Button></CardAction>
            </CardHeader>
            <CardContent>
                <p>{vacancy.desc}</p>
            </CardContent>
            <CardFooter className="text-sm">
                <p>Posted {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}</p>
            </CardFooter>
        </Card>
    );
}
