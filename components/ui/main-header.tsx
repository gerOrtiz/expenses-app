'use client';
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";

import classes from './main-header.module.css';
import logoImg from '@/assets/transparent-logo.png';
import logoIcon from '@/assets/logo.png';
import logoTitle from '@/assets/transparent-title.png';

import { Button, Drawer, IconButton, Menu, MenuHandler, MenuItem, MenuList, Spinner, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Text } from "./Text";

export default function MainHeader() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [backgroundClass, setBackgroundClass] = useState<string>(classes.filled);

	useEffect(() => {
		if (pathname !== '/') return setBackgroundClass(classes.filled);
		const heroHeight = window.innerHeight;
		const handleScroll = () => {
			if (window.scrollY <= heroHeight) {
				setBackgroundClass(classes.transparent);
			} else setBackgroundClass(classes.filled);
		}
		window.addEventListener('scroll', handleScroll);
		setBackgroundClass(classes.transparent);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [pathname]);


	const openDrawer = () => setOpen(true);
	const closeDrawer = () => setOpen(false);

	const logoutHandler = () => {
		signOut();
	}
	return (
		<>
			<header className={`w-11/12 lg:w-10/12 rounded-xl place-self-center ${pathname === '/' ? 'fixed' : 'sticky'}  ${classes.header} ${backgroundClass}`}>
				<div className="lg:flex hidden w-full justify-between items-center">
					<Link className={classes.logo} href="/" aria-label="Go to homepage">
						<Image src={logoImg} alt="Expenses logo" width={280} priority />
					</Link>

					<nav className={classes.nav}>
						<ul>
							{!session && status === 'loading' && (<>

								<li><Spinner /> </li>
							</>)}

							{!session && status != 'loading' && (<li>
								<Link href="/login" className={classes['btn-link']}>	<Button variant="filled" className="filled hover:-translate-y-1" >{`Get started`}</Button></Link>
							</li>)}

							{session && status === 'authenticated' && (<>
								<li>
									<Link className={classes.link} href="/dashboard">{`Dashboard`}</Link>
								</li>
								<li>
									<Link className={classes.link} href="/simple-table">{`Expenses`}</Link>
								</li>
								<li>
									<Link className={classes.link} href="/reports">{`Reports`}</Link>
								</li>
								<li>
									{/* <Button variant="outlined" color="blue" className="outlined hover:-translate-y-1" onClick={logoutHandler} >{`Logout`}</Button> */}
									<Menu
										animate={{
											mount: { y: 0 },
											unmount: { y: 25 },
										}}
									>
										<MenuHandler>
											<Button variant="text" className="flex gap-2 items-center p-1 normal-case">
												<div className="w-7 h-7 p-1 flex items-center justify-center rounded-full border border-blue-700 text-blue-700">
													<FontAwesomeIcon icon={faUser} size="lg" />
												</div>
												<Text variant="label" className="text-blue-700">{session.user.name}</Text>
											</Button>
											{/* <div className="flex gap-2 items-center">
												<IconButton aria-label={`User options`} className="rounded-full" size="sm" variant="outlined" color="blue">
													<FontAwesomeIcon icon={faUser} size="xl" />
												</IconButton>
												<Text variant="label" className="text-blue-800">{session.user.name}</Text>
											</div> */}
										</MenuHandler>
										<MenuList>
											<MenuItem className="flex items-center" onClick={logoutHandler}>
												<Text variant="label">{`Logout`}</Text>
											</MenuItem>
										</MenuList>
									</Menu>

								</li>
							</>)}
						</ul>
					</nav>
				</div>
				<div className="lg:hidden flex w-full">
					<div className="flex w-full justify-between">
						<Button variant="text" className="p-0" onClick={openDrawer} aria-label={`Open drawer`}>
							<div className="flex gap-4 items-center">
								<Image src={logoIcon} alt="Expenses icon" width={40} priority />
								<FontAwesomeIcon icon={faChevronRight} size="1x" className="text-indigo-600" />
							</div>
						</Button>
						<div className="flex items-center">
							<Image src={logoTitle} alt="Expenses app title" width={150} className="opacity-50" />
						</div>
					</div>

					<Drawer open={open} onClose={closeDrawer} className="p-4 bg-white shadow-2xl shadow-blue-gray-900/80" >
						<div className="flex flex-col w-full ">
							<div className="w-full flex justify-between items-center mb-8 ">
								<Image src={logoImg} alt="Expenses logo mobile" width={150} priority />
								<IconButton variant="text" onClick={closeDrawer} aria-label="Close menu" >
									<FontAwesomeIcon icon={faTimes} color="gray" size="lg" className="text-indigo-600" />
								</IconButton>

							</div>
							<ul className="flex flex-col gap-5">
								{!session && status != 'loading' && (<li>
									<Link href="/login">
										<Typography variant="h6" color="blue-gray" >{`Login / Signup`}</Typography>
									</Link>
								</li>)}
								{session && status != 'loading' && (<>

									<li>
										<Link href="/" onClick={closeDrawer} className="text-indigo-600 underline underline-offset-2">{`Home`}</Link>
									</li>
									<li>
										<Link href="/dashboard" onClick={closeDrawer} className="text-indigo-600 underline underline-offset-2">{`Dashboard`}</Link>
									</li>
									<li>
										<Link href="/simple-table" onClick={closeDrawer} className="text-indigo-600 underline underline-offset-2">{`Expenses`}</Link>
									</li>
									<li>
										<Link href="/reports" onClick={closeDrawer} className="text-indigo-600 underline underline-offset-2">{`Reports`}</Link>
									</li>
									<li>
										<Button variant="outlined" className="outlined" color="blue" onClick={logoutHandler} >{`Logout`}</Button>
									</li>

								</>)}
							</ul>
						</div>
					</Drawer>
				</div>

			</header>

		</>
	);
}
