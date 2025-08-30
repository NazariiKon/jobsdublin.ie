import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircleIcon, ChevronLeftIcon } from "lucide-react"
import { employer_signup, get_current_user, login } from "@/api/auth"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { components } from "@/types/api"
import { clearUser, setUser } from "@/store/userSlice"

type User = components['schemas']['UserRead'];


export function EmployersRegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwdInputRef = useRef<HTMLInputElement>(null);
  const pwdConfInputRef = useRef<HTMLInputElement>(null);
  const cmpNameInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [regError, setRegError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // cancel reloading 
    let email = emailInputRef.current?.value.trim();
    const password = pwdInputRef.current?.value.trim();
    const confPassword = pwdConfInputRef.current?.value.trim();
    const cmpName = cmpNameInputRef.current?.value.trim();
    const firstName = firstNameInputRef.current?.value.trim();
    const lastName = lastNameInputRef.current?.value.trim();
    const phone = phoneInputRef.current?.value.trim();
    if (user) {
      email = user.email
    }

    if (formRef.current?.checkValidity() && email) {
      if (!user) {
        if (password !== confPassword) {
          setRegError("Passwords do not match")
          return;
        }
      }

      const signup_result = await employer_signup({
        email,
        password,
        authType: "employer",
        name: firstName,
        surname: lastName,
        cmp: cmpName,
        phone
      });
      if (signup_result.success) {
        get_current_user().then(res => {
          console.log(res)
          if (res.success) {
            dispatch(setUser(res.user));
          } else {
            dispatch(clearUser());
          }
        }).finally(() => {
          setLoading(false)
          navigate("/employers")
        });
      }
      else {
        console.error(signup_result.error)
        setRegError(signup_result.error)
      }
    } else {
      formRef.current?.reportValidity();
    }
  }


  if (loading) return <div>Loading...</div>

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <Button onClick={() => navigate("/")} variant="ghost" size="icon" className="size-8">
            <ChevronLeftIcon />
          </Button>
          <CardTitle className="text-xl">Advertise a job today</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleFormSubmit}>
            <div className="grid gap-5">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  {regError != null && (
                    <Alert variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle>Sign up error</AlertTitle>
                      <AlertDescription>
                        <p>{regError}</p>
                      </AlertDescription>
                    </Alert>
                  )}
                  {!user && (
                    <>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        ref={emailInputRef}
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                    </>
                  )}

                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="cmp">Company name</Label>
                  </div>
                  <Input id="cmp" ref={cmpNameInputRef} type="text" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="firstName">First name</Label>
                  </div>
                  <Input id="firstName" ref={firstNameInputRef} type="text" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="lastName">Last name</Label>
                  </div>
                  <Input id="lastName" ref={lastNameInputRef} type="text" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="phone">Phone number</Label>
                  </div>
                  <Input id="phone" ref={phoneInputRef} type="tel" pattern="[0-9]{10}"
                    placeholder="0123456789" required />
                </div>
                {!user && (
                  <>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" ref={pwdInputRef} type="password" required />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="confirmPassword">Confirm your password</Label>
                      </div>
                      <Input id="confirmPassword" ref={pwdConfInputRef} type="password" required />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a onClick={() => navigate("/login")} href="" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}