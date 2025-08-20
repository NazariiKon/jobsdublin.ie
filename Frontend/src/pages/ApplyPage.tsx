import ApplyForm from "@/components/ApplyForm";
import { useParams } from "react-router-dom";

export default function ApplyPage() {
    const { id } = useParams<{ id: string }>();
    return (
        <>
            <ApplyForm vacancyId={Number(id)}></ApplyForm>
        </>
    )
}
