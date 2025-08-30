import { Briefcase, ChevronRightIcon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { clearUser } from '@/store/userSlice';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

type NavbarProps = {
    currentPath: string;
};

export default function Navbar({ currentPath }: NavbarProps) {
    const user = useSelector((state: RootState) => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between w-full p-2 border-b-1 border-black gap-2">
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
            <div className="hidden sm:block">
                {currentPath === "/regemployers" ? (
                    <>
                        <Button variant="link" onClick={() => navigate("/")} >Find Job</Button>

                    </>
                ) : (
                    <>
                        <Button variant="link" onClick={() => navigate("/employers")} >Employers / Post Job</Button>
                    </>
                )
                }
            </div>
            <div className="sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost"><Menu></Menu></Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle></SheetTitle>
                            <SheetDescription>
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col gap-1">
                            <Button className="flex items-center justify-between w-full" variant="link"
                                onClick={() => navigate("/")}>
                                <span>Home</span>
                                <ChevronRightIcon className="w-5 h-5" />
                            </Button>
                            {currentPath === "/regemployers" ? (
                                <>
                                    <Button className="flex items-center justify-between w-full" variant="link"
                                        onClick={() => navigate("/")}>
                                        <span>Find Job</span>
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="flex items-center justify-between w-full" variant="link"
                                        onClick={() => navigate("/employers")}>
                                        <span>Employers / Post Job</span>
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </Button>
                                </>
                            )
                            }
                        </div>

                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}