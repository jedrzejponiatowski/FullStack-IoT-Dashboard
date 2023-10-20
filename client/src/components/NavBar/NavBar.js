import React from "react";
import { NavLink, useNavigate} from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate(); // Inicjalizujemy hook useNavigate

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    navigate("/login"); // Używamy hooka navigate do przekierowania
  };

  return (
    <nav>
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          <h2>IoT Dashboard</h2>
        </NavLink>
        <div className="nav-links">
          <button onClick={logoutHandler} className="nav-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
