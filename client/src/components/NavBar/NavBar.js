import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
        <div className="nav-buttons">
          <NavLink exact to="/" className="nav-link">
            IoT Dashboard
          </NavLink>
          <button onClick={() => navigate("/realtime")} className="nav-btn">
            Realtime
          </button>
          <button onClick={() => navigate("/archival")} className="nav-btn">
            Archival
          </button>
          <button onClick={() => navigate("/manage")} className="nav-btn">
            Manage
          </button>
          <button onClick={logoutHandler} className="nav-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
