import { useState } from "react"
import type { components } from '@/types/api';
import VacanciesList from "@/components/VacanciesList";
import FullVacancyInfo from "@/components/FullVacancyInfo";
import { Link, useNavigate } from "react-router-dom";


import { isMobile } from "react-device-detect";
import SearchBar from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Code2, Mail, PlayCircle, Lock, ArrowRight } from "lucide-react";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

type Vacancy = components['schemas']['VacancyRead'];

export default function MainPage() {
    const [currentVacancy, setCurrentVacancy] = useState<Vacancy | null>(null)
    const [location, setLocation] = useState<String>("Dublin")
    const [keyWords, setKeyWords] = useState<String | null>(null)
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.currentUser);


    const handleCardClick = (vacancy: Vacancy) => {
        setCurrentVacancy(vacancy)
        if (isMobile && currentVacancy != null) {
            navigate(`/viewjob/${vacancy.id}`, { state: { vacancy } })
        }
    }

    return (
        <>
            <div className="w-full p-[2%] md:p-0 md:w-3/4 justify-self-center mt-4">
                {/* DEVELOPER DEMO — TOP OF HERO */}
                {!user &&
                    <div className="w-full max-w-2xl mb-12 p-6 bg-gradient-to-br from-amber-50/95 via-slate-50 to-indigo-50/80 border-2 border-dashed border-amber-200/70 backdrop-blur-md rounded-3xl shadow-2xl ring-2 ring-amber-100/50 hover:ring-amber-200 hover:shadow-3xl transition-all duration-500 z-30 mx-auto">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                                <PlayCircle className="w-4 h-4" />
                                <span>PORTFOLIO DEMO</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mb-2 pt-2">
                            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full mt-1.5 animate-ping flex-shrink-0"></div>
                            <Code2 className="w-5 h-5 text-slate-700 flex-shrink-0" />
                            <h4 className="text-sm font-bold text-slate-900 tracking-tight uppercase ">Try My Fullstack Skills</h4>
                        </div>

                        <p className="text-xs mb-2 text-slate-600">To test my website & skills, use this demo account:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                            <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-xl border border-slate-200/60 shadow-sm text-xs">
                                <div className="flex items-center gap-1 text-slate-500 mb-1">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="font-medium">Email</span>
                                </div>
                                <p className="font-mono text-sm text-slate-900 font-semibold text-center">
                                    admin@gmail.com
                                </p>
                            </div>
                            <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-3 rounded-xl border border-slate-200/60 shadow-sm text-xs">
                                <div className="flex items-center gap-1 text-slate-500 mb-1">
                                    <Lock className="w-3.5 h-3.5" />
                                    <span className="font-medium">Password</span>
                                </div>
                                <p className="font-mono text-sm text-slate-900 font-semibold text-center">
                                    admin@gmail.com
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 mb-4 leading-tight">
                            For a realistic test, I recommend creating your own account.
                        </p>

                        <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-xl hover:shadow-2xl border-0 px-6 py-3 transform hover:-translate-y-1 transition-all duration-300 group"
                            asChild
                        >
                            <Link state={{
                                demo: true,
                                email: "admin@gmail.com",
                                password: "admin@gmail.com",
                            }} to="/login" className="flex items-center gap-2">
                                Launch Interactive Demo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>

                        <p className="text-xs text-slate-500 mt-3 text-center italic leading-tight px-1">
                            *Temporary showcase feature (removed in production)
                        </p>
                    </div>
                }
                <SearchBar setLocation={setLocation} setKeyWords={setKeyWords}></SearchBar>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <VacanciesList location={location} keyWords={keyWords} setCurrentVacancy={setCurrentVacancy} onClick={handleCardClick}></VacanciesList>
                    <div className="hidden md:block">
                        <FullVacancyInfo vacancy={currentVacancy} onClick={() => navigate(`/apply/${currentVacancy?.id}`)}></FullVacancyInfo>
                    </div>
                </div >
            </div>
        </>
    )
}