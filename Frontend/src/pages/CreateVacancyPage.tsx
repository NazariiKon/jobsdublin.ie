import CreateVacancyForm from "@/components/CreateVacancyForm";
import { useLocation } from "react-router-dom";

export default function CreateVacancyPage() {
    const { state } = useLocation();

    return (
        state ? (
            <CreateVacancyForm companyId={Number(state.id)} vacancy={state.vacancy ?? null}></CreateVacancyForm>
        ) :
            (
                <p>Something wrong with your account</p>
            )

    );
}