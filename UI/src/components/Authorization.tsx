import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { GoogleLogin } from '@react-oauth/google';
// import {jwtDecode} from 'jwt-decode';
import './Authorization.css'; // Optional custom styles
import { Login, Register } from '../api';
import { Toast } from 'primereact/toast';

interface Props {
  onLoginSuccess: (token: string) => void;
  onRegisterSuccess: (token: string) => void;
}
const STORAGE_KEY = "superduperSecret";

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  // const handleGoogleSuccess = (credentialResponse: any) => {
  //   const token = credentialResponse.credential;
  //   setGoogleToken(token);
  // };

  const handleSubmit = () => {
    if (mode === 'login') {
      // 🔐 Login request (simulate)
      console.log('Logging in with', { email, password });
      // onLoginSuccess('fake-login-token');
      try {
        Login({ email, password }).then((data : any) => {
          if(data){
          console.log("res", data.access_token);
          localStorage.setItem(STORAGE_KEY, data.access_token);
          showToast("redirecting...")
          window.location.href = '/'
          }
        }).catch(() => showToast("login failed"));
      }
      catch (error) {
        showToast("login failed");
      }
    } else {
      // 📝 Register request
      // if (!googleToken) return alert('Please login with Google first');
      if (password !== rePassword) return alert('Passwords do not match');
      try{
        Register({email, password, googleToken}).then((data) => {
          console.log("res",data);
          showToast("register completed")
          setMode('login');
        }).catch((error:any) =>{
          console.log(error);
          showToast("register failed")
        });
      }
      catch(error){
        console.log("error",error);
        showToast("fail to register");
      }
      
      // .then((res)=>console.log("res",res)).catch((error)=> console.log("error",error));
      // onRegisterSuccess('fake-register-token');
    }
  };
  
    const showToast = (message: string) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Notice',
      detail: message,
      life: 500
    });
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />
      <Card title={mode === 'login' ? 'Login' : 'Register'} className="auth-card">
        <div className="p-fluid">
          <div className="field">
            <label>Email</label>
            <InputText value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>

          {mode === 'register' && !googleToken && (
            <div className="field mt-3">
              {/* <label>Sign in with Google first</label> */}
              {/* <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Google login failed')} /> */}
              <Divider />
            </div>
          )}

          {mode === 'login' || (mode === 'register') ? (
            <>
              <div className="field mt-3">
                <label>Password</label>
                <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
              </div>
              {mode === 'register' && (
                <div className="field mt-3">
                  <label>Confirm Password</label>
                  <Password value={rePassword} onChange={(e) => setRePassword(e.target.value)} feedback={false} toggleMask />
                </div>
              )}
              <Button label={mode === 'login' ? 'Login' : 'Register'} className="mt-3" onClick={handleSubmit} />
            </>
          ) : null}

          <Divider />
          <p className="text-center">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Button className="p-button-link" onClick={() => setMode('register')} label="Register" />
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Button className="p-button-link" onClick={() => setMode('login')} label="Login" />
              </>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
