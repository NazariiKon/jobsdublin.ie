import CreateVacancyForm from "@/components/CreateVacancyForm";
import { useParams } from "react-router-dom";


export default function CreateVacancyPage() {
    const { id } = useParams();

    return (
        id ? (
            <CreateVacancyForm companyId={Number(id)}></CreateVacancyForm>
        ) :
            (
                <p>Something wrong with your account</p>
            )

    );
}