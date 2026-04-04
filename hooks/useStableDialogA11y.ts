'use client';

import { useEffect, useRef } from "react";

export function useStableDialogA11y(
	isOpen: boolean,
	labelId: string,
	descriptionId: string
) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const timer = setTimeout(() => { //it's about waiting for the portal to finish its own commit cycle
			const dialogEl = ref.current?.closest('[role="dialog"]');
			if (dialogEl) {
				dialogEl.setAttribute('aria-labelledby', labelId);
				dialogEl.setAttribute('aria-describedby', descriptionId);
			}
		}, 0);
		return () => clearTimeout(timer);
	}, [isOpen, labelId, descriptionId]);

	return ref;
}
