import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "../protectedRoutes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import ProtectedAdminRoute from "../protectedRoutes/ProtectedAdminRoutes";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Route>
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;