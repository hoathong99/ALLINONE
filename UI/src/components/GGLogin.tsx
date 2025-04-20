// components/GoogleLogin.tsx
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = "458291474425-l9jd9q0a4qd6dgn6q2cjehv40btqid31.apps.googleusercontent.com";
const STORAGE_KEY = "superduperSecret";

const LoginURL = "http://localhost:3000/auth-controller/login";
const GoogleLogin = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      // Change this:
      fetch('http://localhost:3000/auth-controller/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setUser(data.user))
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
    if(user){
      console.log("user",user);
    }
  },[user])
  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    console.log("Google JWT ID Token:", idToken);

    // Save token
    localStorage.setItem(STORAGE_KEY, idToken);

    // Verify with backend
    fetch('http://localhost:3000/auth-controller/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data.user);
        console.log("login response", data);
      })
      .catch(err => {
        console.error("Failed to verify token", err);
        localStorage.removeItem(STORAGE_KEY);
      });
  };

  const logOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <div>
      {!user && <div id="google-button"></div>}
      {user && (
        <div>
          <p>👋 Welcome, {user.name}</p>
          {/* <img src={user.picture} alt="Profile" width={40} height={40} style={{ borderRadius: "50%" }} /> */}
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
