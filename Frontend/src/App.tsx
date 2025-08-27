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

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<WithNavbarLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/viewjob/:id" element={<ViewJobPage />} />
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
