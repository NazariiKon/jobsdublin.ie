import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import ApplyPage from "./pages/ApplyPage";
import WithNavbarLayout from "@/layouts/WithNavbar";
import NoNavbarLayout from "./layouts/NoNavbar";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewJobPage from "./pages/ViewJobPage";
import ViewCompanyPage from "./pages/ViewCompanyPage";
import EmployersRegistrationPage from "./pages/EmployersRegistrationPage";
import EmployersHomePage from "./pages/EmployersHomePage";
import { useEffect, useState } from "react";
import { get_current_user } from "./api/auth";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    get_current_user().then(res => {
      if (res.success) {
        dispatch(setUser(res.user));
      } else {
        dispatch(clearUser());
      }
    }).finally(() => {
      setLoading(false)
    });
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<WithNavbarLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/viewjob/:id" element={<ViewJobPage />} />
            <Route path="/cmp/:id" element={<ViewCompanyPage />} />
            <Route path="/regemployers" element={<EmployersRegistrationPage />} />
            <Route
              path="/employers"
              element={
                <ProtectedRoute requireEmployer>
                  <EmployersHomePage />
                </ProtectedRoute>
              } />
            <Route
              path="/apply/:id"
              element={
                <ProtectedRoute>
                  <ApplyPage />
                </ProtectedRoute>
              } />
          </Route>

          <Route element={<NoNavbarLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
