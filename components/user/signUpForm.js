'use client';
import SubmitButton from "../ui/submitButton"
import { signUpUser } from '@/lib/user/actions';
import { useFormState } from 'react-dom';

import classes from './form.module.css';
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUpUser, { message: null, user: null });
  const router = useRouter();
  useEffect(() => {
    async function login() {
      if (state.message && state.user) {

        const result = await signIn('credentials', {
          redirect: false,
          email: state.user.email,
          password: state.user.password
        });
        if (!result.error) {
          router.replace('/dashboard');
        }
      }
    }
    login();
  }, [state, router])

  return (<>
    <form className={classes.form} action={formAction}>
      <p>
        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" name="name" required />
      </p>
      <p>
        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" name="email" required />
      </p>
      <p>
        <label htmlFor="title">Contraseña</label>
        <input type="password" id="title" name="password" minLength={7} required />
      </p>

      {state.message && <p>{state.message}</p>}
      <p className={classes.actions}>
        <SubmitButton text="Registrate" />
      </p>
    </form>
  </>);
}