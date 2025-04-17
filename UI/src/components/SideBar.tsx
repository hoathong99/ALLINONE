import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from '../assets/twendee_logo.png';
import GoogleLogin from "./GGLogin";

function Sidebar() {
  const location = useLocation();

  useEffect(() => {
    const submenu = document.getElementById("hrSubmenu");
    if (submenu) {
      if (
        ["/employee", "/insurance", "/attendance", "/meeting-room"].includes(location.pathname)
      ) {
        submenu.classList.add("show");
      } else {
        submenu.classList.remove("show");
      }
    }
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: 250, height: '100vh', backgroundColor: '#1f2c64' }}>
      <img src={logo} alt="Twendee Logo" style={{ height: 50 }} className="mb-4" />
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
            <ul className="nav flex-column ms-3">
              <li><Link to="/employee" className="nav-link text-white">Employee</Link></li>
              <li><Link to="/form-factory" className="nav-link text-white">Form Factory</Link></li>
              <li><Link to="/dashboard" className="nav-link text-white">Dashboard</Link></li>
              <li><Link to="/department" className="nav-link text-white">Department</Link></li>
              <li><Link to="/contract" className="nav-link text-white">Contract</Link></li>
              <li><Link to="/recuitment" className="nav-link text-white">Recuitment</Link></li>
              <li><Link to="attendance" className="nav-link text-white">Attendance</Link></li>
              <li><Link to="/leave" className="nav-link text-white">Leave</Link></li>
              <li><Link to="/report" className="nav-link text-white">Report</Link></li>
            </ul>
        </li>
      </ul>
      <div>
        <footer><GoogleLogin /></footer>
      </div>
    </div>
  );
}

export default Sidebar;
