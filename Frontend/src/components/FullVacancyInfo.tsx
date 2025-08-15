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
import { Briefcase, MapPin, HandCoins } from "lucide-react";
import { Button } from "./ui/button";

type Vacancy = components['schemas']['VacancyRead'];

interface Props {
    vacancy: Vacancy | null
}

export default function FullVacancyInfo({ vacancy }: Props) {
    if (vacancy) {
        return (
            <Card className="h-screen">
                <CardHeader>
                    <CardTitle className="font-bold text-3xl">{vacancy.title}</CardTitle>
                    <CardDescription className="text-base gap-5">
                        <div className="flex items-center gap-1">
                            <Briefcase className="size-4 mt-1 text-black" />
                            {vacancy.company_name}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4 mt-1 text-black" />
                            {vacancy.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <HandCoins className="size-4 text-black" />
                            €{vacancy.min_salary?.toLocaleString()} - €{vacancy.max_salary?.toLocaleString()} per {vacancy.salary_period}
                        </div>
                    </CardDescription>

                    <CardAction><Button>Apply</Button></CardAction>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                    <p className="font-bold text-xl">Full job description</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus volutpat dolor, a dapibus sapien molestie nec. Aenean posuere accumsan finibus. Suspendisse venenatis, est at semper hendrerit, neque arcu euismod ante, vitae lobortis ipsum lectus id purus. Nulla laoreet ex vitae sem scelerisque hendrerit. Nulla facilisi. Praesent consectetur pretium eros. Quisque ac arcu laoreet, varius dui vel, ultricies sapien.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempus volutpat dolor, a dapibus sapien molestie nec. Aenean posuere accumsan finibus. Suspendisse venenatis, est at semper hendrerit, neque arcu euismod ante, vitae lobortis ipsum lectus id purus. Nulla laoreet ex vitae sem scelerisque hendrerit. Nulla facilisi. Praesent consectetur pretium eros. Quisque ac arcu laoreet, varius dui vel, ultricies sapien.

                        Nullam interdum pellentesque tortor eu ornare. Morbi egestas vitae urna eget vehicula. Fusce elit nisi, semper nec commodo ac, sodales sit amet tellus. Cras mi arcu, volutpat non viverra ac, tincidunt nec odio. Aliquam in lorem a sem cursus accumsan. Aenean vel purus neque. Vivamus luctus dictum odio id fringilla. Suspendisse rhoncus tempus ligula, ac porttitor lectus aliquam sed. Quisque ac enim quam. Phasellus quam justo, facilisis vitae porta non, imperdiet sed magna. Nulla dapibus urna quam, sodales scelerisque justo lobortis quis. Sed ipsum purus, dignissim quis lacus in, dapibus mattis enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam nec ullamcorper leo. Sed at ex turpis. Pellentesque vitae aliquam tortor, vitae scelerisque elit.</p>
                </CardContent>
                <CardFooter className="text-sm">
                </CardFooter>
            </Card>
        );
    }
}
