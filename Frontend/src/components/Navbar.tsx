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
            <div className="flex-1">
                <a className="flex items-center gap-2 w-min font-medium text-xl md:text-3xl cursor-pointer" onClick={() => navigate("/")} >
                    <div className="mt-2 bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                        <Briefcase className="size-5" />
                    </div>
                    jobsdublin.ie
                </a>
            </div>
            {/* Right side */}
            {user ? (
                <Button onClick={() => {
                    localStorage.removeItem('token');
                    dispatch(clearUser())
                }} variant="ghost">Log out</Button>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => navigate("/login")} variant="ghost">Sign In</Button>
                    <Button onClick={() => navigate("/registration")} >Sign Up</Button>
                </div>
            )}

        </div>
    )
}