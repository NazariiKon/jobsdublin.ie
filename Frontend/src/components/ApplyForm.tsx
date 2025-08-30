import { Label } from "@/components/ui/label"
import { Button } from "./ui/button"
import { useRef, useState } from "react"
import DragZone from "@/components/DragZone"
import { cn } from "@/lib/utils"
import type { FileRejection, FileWithPath } from "react-dropzone"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { apply } from "@/api/vacancy"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface ApplyFormProps {
    vacancyId: number
}

export default function ApplyForm({ vacancyId }: ApplyFormProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null)
    const [rejectedFile, setRejectedFiles] = useState<FileRejection | null>(null);
    const navigate = useNavigate();

    const handleZoneClick = () => {
        inputRef.current?.click()
    }

    const handleApplyButtonClick = async () => {
        if (selectedFile != null) {
            const result = await apply(selectedFile, vacancyId)
            if (result.success) {
                toast("✅ CV Submitted Successfully!", {
                    description: "Your application has been sent. Good luck!",
                    action: {
                        label: "View",
                        onClick: () => console.log("User clicked View"),
                    },
                });
                navigate("/");
            }
            else {

            }

        }
    }

    const readFile = () => {
        if (selectedFile != null) {
            return URL.createObjectURL(selectedFile)
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen py-[2%] md:w-1/2 p-2 justify-self-center gap-3 text-3xl text-base font-normal">
            <Label htmlFor="resume" className="text-lg font-bold">
                Add a CV for the employer
            </Label>
            {selectedFile && (
                <iframe
                    src={readFile()}
                    className="w-full h-full hidden lg:block"
                />
            )}
            <DragZone onClick={handleZoneClick} inputRef={inputRef} setRejectedFile={setRejectedFiles} setSelectedFile={setSelectedFile}
                className={cn(
                    "flex-grow text-base cursor-pointer flex flex-col border-2 border-dashed items-center justify-center",
                    selectedFile && "hidden"
                )} />


            {selectedFile && (
                <div className="border-1 border-dashed  grid grid-cols-[10fr_1fr] items-center p-[1%]">
                    <p>{selectedFile.name}</p>
                    <Button variant="link" onClick={handleZoneClick}>Change</Button>
                </div>
            )}
            {rejectedFile && (
                <Alert variant="destructive">
                    <Terminal />
                    <AlertTitle>Uploading file error</AlertTitle>
                    <AlertDescription>
                        {rejectedFile.errors[0].message}
                    </AlertDescription>
                </Alert>
            )}
            <Button onClick={handleApplyButtonClick}>Continue</Button>
        </div>

    )
}