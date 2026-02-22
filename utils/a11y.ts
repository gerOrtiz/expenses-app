export const focusableSelectors = 'a,button,input,textarea,select,details,[tabindex]:not([tabindex="-1"])';

export function trapFocus(element: HTMLElement) {
	const focusable = element.querySelectorAll(focusableSelectors);
	const firstFocusable = focusable[0] as HTMLElement;
	const lastFocusable = focusable[focusable.length - 1] as HTMLElement;

	function trapTabKey(e: KeyboardEvent) {
		if (e.key != 'Tab') return;
		if (e.shiftKey) {
			if (document.activeElement === firstFocusable) {
				lastFocusable.focus();
				e.preventDefault();
			}
		} else {
			if (document.activeElement === lastFocusable) {
				firstFocusable.focus();
				e.preventDefault();
			}
		}
	}

	element.addEventListener('keydown', trapTabKey);
	return () => element.removeEventListener('keydown', trapTabKey);

}
