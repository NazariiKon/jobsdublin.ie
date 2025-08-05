import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { components } from '@/types/api';

type User = components['schemas']['UserRead'];

interface NavbarProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Navbar({ user, setUser }: NavbarProps) {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between w-full p-2 border-b-1 border-black">
            {/* Left side */}
            <a className="flex items-center gap-2 font-medium text-3xl">
                <div className="mt-2 bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                    <Briefcase className="size-5" />
                </div>
                jobsdublin.ie
            </a>
            {/* Right side */}
            <div className="flex items-center gap-2">
                {user ? (
                    <>
                        <Button onClick={() => {
                            localStorage.removeItem('token');
                            setUser(null)
                        }} variant="ghost">Log out</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => navigate("/login")} variant="ghost">Sign In</Button>
                        <Button onClick={() => navigate("/registration")} >Sign Up</Button>
                    </>
                )}

            </div>
        </div >
    )
}