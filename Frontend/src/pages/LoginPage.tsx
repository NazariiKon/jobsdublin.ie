import { Briefcase } from "lucide-react"
import { LoginForm } from "@/components/LoginForm"
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="cursor-pointer flex w-full max-w-sm flex-col gap-6">
        <a onClick={() => navigate("/")} className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Briefcase className="size-4" />
          </div>
          jobsdublin.ie
        </a>
        <LoginForm />
      </div>
    </div>
  )
}