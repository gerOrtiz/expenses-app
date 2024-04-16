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
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" name="name" required />
      </p>
      <p>
        <label htmlFor="email">Your email</label>
        <input type="email" id="email" name="email" required />
      </p>
      <p>
        <label htmlFor="title">Passsword</label>
        <input type="password" id="title" name="password" minLength={7} required />
      </p>

      {state.message && <p>{state.message}</p>}
      <p className={classes.actions}>
        <SubmitButton text="Sign up" />
      </p>
    </form>
  </>);
}