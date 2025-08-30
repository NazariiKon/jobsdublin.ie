import { EmployersRegistrationForm } from "@/components/EmployersRegistrationForm";

export default function EmployersRegistrationPage() {

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="cursor-pointer flex w-full max-w-md flex-col gap-6">
                <EmployersRegistrationForm />
            </div>
        </div>
    )
}
