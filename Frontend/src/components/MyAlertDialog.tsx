import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface MyAlertDialogButtonProps {
    children: any,
    onClick: () => void;
}

export function MyAlertDialogButton({ children, onClick }: MyAlertDialogButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}>
                <Button>{children}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This vacancy will be moved to your archive. It will no longer be visible to job seekers, but you will still be able to access it in your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter >
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
