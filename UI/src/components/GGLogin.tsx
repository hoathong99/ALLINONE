// components/GoogleLogin.tsx
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLogin = () => {
  useEffect(() => {
    // @ts-ignore - gapi is loaded from the script tag
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "458291474425-l9jd9q0a4qd6dgn6q2cjehv40btqid31.apps.googleusercontent.com", // replace with yours
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button")!,
        { theme: "outline", size: "large" }
      );

      // Optional: enable auto select
      // window.google.accounts.id.prompt();
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    const jwt = response.credential;
    console.log("Google JWT ID Token:", jwt);

    // Optional: Exchange this ID token with your backend to get an access token (OAuth2 flow)
  };

  return (
    <div>
      <div id="google-button"></div>
    </div>
  );
};

export default GoogleLogin;
