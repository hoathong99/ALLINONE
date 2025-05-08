// components/GoogleLogin.tsx
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const STORAGE_KEY = "superduperSecret";
const LoginURL = `${GATEWAY_URL}/auth-controller/login`;

const GoogleLogin = () => {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      // Change this:
      fetch(LoginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setUser(data.user);
          setIsLogin(true);
        })
        .catch(() => localStorage.removeItem(STORAGE_KEY));
    }

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button")!,
        { theme: "outline", size: "large" }
      );

      // Uncomment this if you want automatic login popup
      // window.google.accounts.id.prompt();
    }
  }, []);

  useEffect(() => {
    if (!isLogin && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById("google-button")!,
        { theme: "outline", size: "large" }
      );
    }
  }, [isLogin]); // Run this effect when isLogin changes

  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    console.log("Google JWT ID Token:", idToken);

    // Save token
    localStorage.setItem(STORAGE_KEY, idToken);

    // Verify with backend
    fetch(LoginURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data.user);
        setIsLogin(true);
        console.log("login response", data);
      })
      .catch(err => {
        console.error("Failed to verify token", err);
        setIsLogin(false);
        localStorage.removeItem(STORAGE_KEY);
      });
  };

  const logOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setIsLogin(false);
  };

  return (
    <div>
      {!isLogin && <div id="google-button"></div>}
      {isLogin && (
        <div>
          <p>Welcome</p>
          {/* <img src={user.picture} alt="Profile" width={40} height={40} style={{ borderRadius: "50%" }} /> */}
          <br />
          <button onClick={()=>logOut()}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
