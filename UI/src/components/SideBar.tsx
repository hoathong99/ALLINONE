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
              {/* <li><Link to="/employee" className="nav-link text-white">Employee</Link></li> */}
              <li><Link to="/form-factory" className="nav-link text-white">Form Factory</Link></li>
              {/* <li><Link to="/graph-template" className="nav-link text-white">Form Template</Link></li> */}
              <li><Link to="/component-template" className="nav-link text-white">component template</Link></li>
              <li><Link to="/component-template-generator" className="nav-link text-white">Generate page</Link></li>
              <li><Link to="/flow-editor" className="nav-link text-white">Flow Editor</Link></li>
              <li><Link to="component-template-2" className="nav-link text-white">Attendance</Link></li>
              <li><Link to="/leave" className="nav-link text-white">Leave</Link></li>
              <li><Link to="/testing" className="nav-link text-white">Testing</Link></li>
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
