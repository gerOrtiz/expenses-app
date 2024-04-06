'use client';
import SubmitButton from '@/components/ui/submitButton';
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
        <h1>
          Let's begin by signing up
        </h1>
        <p>{isSigningUp ? 'Already have an account?' : ''} <span className={classesNames} onClick={setSigningHandler}>{isSigningUp ? 'Log In' : 'Sign up'}</span></p>
      </header>
      <main className={classes.main}>
        {isSigningUp && <SignUpForm></SignUpForm>}
        {!isSigningUp && <LoginForm></LoginForm>}
      </main>
    </>
  );
}