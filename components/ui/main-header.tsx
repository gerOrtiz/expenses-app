'use client';
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";

import classes from './main-header.module.css';
import logoImg from '@/assets/transparent-logo.png';
import logoIcon from '@/assets/logo.png';

import { Button, Drawer, IconButton, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function MainHeader() {
	const { data: session, status } = useSession();
	const [open, setOpen] = useState(false);

	const openDrawer = () => setOpen(true);
	const closeDrawer = () => setOpen(false);

	const logoutHandler = () => {
		signOut();
	}
	return (
		<>
			{/* <HeaderBackground /> */}
			<header className={classes.header}>
				<div className="lg:flex hidden w-full justify-between items-center">
					<Link className={classes.logo} href="/">
						<Image src={logoImg} alt="Expenses logo" width={280} priority />
						{/* Expenses App */}
					</Link>

					<nav className={classes.nav}>
						<ul>
							{!session && status != 'loading' && (<li>
								<Link href="/user"><Button color="blue" variant="filled" className="hover:bg-blue-600" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >{`Get started`}</Button> </Link>
							</li>)}

							{session && status != 'loading' && (<>
								<li>
									<Link href="/dashboard">Dashboard</Link>
								</li><li>
									<Button variant="outlined" onClick={logoutHandler} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{`Logout`}</Button>
								</li>
							</>)}
						</ul>
					</nav>
				</div>
				<div className="lg:hidden flex w-full">
					<Button variant="text" className="p-0" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={openDrawer}>
						<div className="flex gap-4 items-center">
							<Image src={logoIcon} alt="Expenses logo" width={50} priority />
							<FontAwesomeIcon icon={faChevronRight} size="lg" />
						</div>
					</Button>
					<Drawer open={open} onClose={closeDrawer} className="p-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
						<div className="flex flex-col w-full ">
							<div className="w-full flex justify-between items-center mb-8 ">
								<Image src={logoImg} alt="Expenses logo" width={150} priority />
								<IconButton placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} variant="text" onClick={closeDrawer} >
									<FontAwesomeIcon icon={faTimes} color="gray" size="lg" />
								</IconButton>

							</div>
							<ul>
								{!session && status != 'loading' && (<li>
									<Link href="/user">
										<Typography variant="h6" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>{`Login / Signup`}</Typography>
									</Link>
								</li>)}
								{session && status != 'loading' && (<>
									<li>
										<Link href="/dashboard">
											<Typography variant="h6" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
												Dashboard
											</Typography>
										</Link>
									</li>
									<li>
										<Button variant="text" onClick={logoutHandler} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
											<Typography variant="h6" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
												{`Logout`}
											</Typography>

										</Button>
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
