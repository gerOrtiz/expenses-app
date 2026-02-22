'use client';

import { useEffect } from "react";

export function AccesibillityTester() {
	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			import('@axe-core/react').then(axeReact => {
				const React = require('react');
				const ReactDOM = require('react-dom');

				axeReact.default(React, ReactDOM, 1000, {
					// config
				});
				console.log('Accesibility testing initialized')
			});
		}
	}, []);
	return null;
}
