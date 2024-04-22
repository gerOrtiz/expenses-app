'use client';
import classes from './form.module.css';
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';


export default function LoginForm() {
  const [state, setState] = useState({ message: null });
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();
  async function submitHandler(event) {
    event.preventDefault();
    setSubmitting(true);
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    let result;

    result = await signIn('credentials', {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword
    });
    if (result.error) {
      setState({ message: result.error });
      setSubmitting(false);
    }
    else router.replace('/dashboard');
  }
  return (<>
    <form className={classes.form} onSubmit={submitHandler}>
      <p>
        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" name="email" ref={emailRef} required />
      </p>
      <p>
        <label htmlFor="title">Contraseña</label>
        <input type="password" id="title" name="password" minLength={7} ref={passwordRef} required />
      </p>

      {state.message && <p>{state.message}</p>}
      <p className={classes.actions}>
        <button disabled={submitting}>
          {submitting ? 'Iniciando sesión...' : 'Inicia sesión'}
        </button>
      </p>
    </form>
  </>);
}