'use client';
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";

import classes from './main-header.module.css';
import logoImg from '@/assets/logo.png';
import HeaderBackground from "./header-background";

export default function MainHeader() {
  const { data: session, status } = useSession();
  function logoutHandler() {
    signOut();
  }
  return (
    <>
      <HeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={logoImg} alt="A plate with food on it" priority />
          Expenses App
        </Link>

        <nav className={classes.nav}>
          <ul>
            {!session && !status != 'loading' && (<li>
              <Link href="/user">Register/login</Link>
            </li>)}

            {session && status != 'loading' && (<>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li><li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>)}
          </ul>
        </nav>
      </header>

    </>
  );
}