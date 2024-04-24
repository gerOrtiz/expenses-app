'use client';
import LoginForm from '@/components/user/loginForm';
import SignUpForm from '@/components/user/signUpForm';
import { useState } from 'react';

import classes from './page.module.css';

export default function UserFormPage() {
  const [isSigningUp, setIsSigningUp] = useState(true);

  function setSigningHandler() {
    setIsSigningUp(!isSigningUp);
  }

  const classesNames = `${classes.highlight} ${classes.link}`;

  return (
    <>
      <header className={classes.header}>
        <h1 className="text-5xl mb-4 text-blue-900">
          Registrate o incia sesión
        </h1>
        <p className="text-blue-950">{isSigningUp ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'} <span className={classesNames} onClick={setSigningHandler}>{isSigningUp ? 'Inicia sesión' : 'Registrate'}</span></p>
      </header>
      <main className={classes.main}>
        {isSigningUp && <SignUpForm></SignUpForm>}
        {!isSigningUp && <LoginForm></LoginForm>}
      </main>
    </>
  );
}