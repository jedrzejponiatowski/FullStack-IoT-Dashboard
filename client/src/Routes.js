import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/App/Dashboard";



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
