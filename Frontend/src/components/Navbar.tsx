import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { clearUser } from '@/store/userSlice';

export default function Navbar() {
    const user = useSelector((state: RootState) => state.user.currentUser);
    const dispatch = useDispatch();
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
                            dispatch(clearUser())
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