import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from '../assets/twendee_logo.png';
// import GoogleLogin from "./GGLogin";
import { Button } from "primereact/button";

function Sidebar() {
  const location = useLocation();
  const [loginstate, setLoginState] = useState(false);
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
    if(localStorage.getItem("superduperSecret")){
      setLoginState(true);
    }
  }, [location.pathname]);

  const Logout = () => {
    localStorage.removeItem("superduperSecret");
    setLoginState(false);
  }

  const Login = () => {
    window.location.href = '/auth';
  }
  
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
            <li><Link to="/demo" className="nav-link text-white">Demo Page</Link></li>
            <li><Link to="/free" className="nav-link text-white"> Anonymous</Link></li>
            <li><Link to="/component-template-generator" className="nav-link text-white">Generate page</Link></li>
            <li><Link to="/flow-editor" className="nav-link text-white">Flow Editor</Link></li>
            {/* <li><Link to="/leave" className="nav-link text-white">Leave</Link></li> */}
            {/* <li><Link to="/testing" className="nav-link text-white">Testing</Link></li> */}
          </ul>
        </li>
      </ul>
      <div>
        {/* <footer><GoogleLogin /></footer> */}
        {!loginstate&&
        <Button
          label="Login"
          icon="pi pi-arrow-right"
          onClick={() => Login()}
        />}
        {loginstate&&
        <Button
          label="Logout"
          icon="pi pi-arrow-right"
          onClick={() => Logout()}
        />}

      </div>
    </div>
  );
}

export default Sidebar;
