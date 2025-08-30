import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface SearchBarProps {
    setLocation: React.Dispatch<React.SetStateAction<String>>,
    setKeyWords: React.Dispatch<React.SetStateAction<String | null>>;
}

export default function SearchBar({ setLocation, setKeyWords }: SearchBarProps) {
    const keywordsInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);

    const handleFindBtnClick = () => {
        if (locationInputRef.current?.value)
            setLocation(locationInputRef.current.value);
        else
            setLocation("Dublin")

        if (keywordsInputRef.current?.value) {
            setKeyWords(keywordsInputRef.current.value);
        }
        else
            setKeyWords(null)
    }
    return (
        <div className="grid md:grid-cols-[1fr_1fr_0.3fr] w-full md:w-2/3 justify-self-center gap-2" >
            <div className="flex items-center gap-2">
                <Search className="size-5 text-black" />
                <Input ref={keywordsInputRef} className="" type="text" placeholder="Job title, keywords or company" />
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="size-5 text-black" />
                <Input ref={locationInputRef} type="text" placeholder="City or district" />
            </div>
            <Button onClick={handleFindBtnClick}>Find jobs</Button>
        </div>
    )
}