import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });
// Mock Web Animations API for Material Tailwind
if (typeof Element.prototype.animate === 'undefined') {
	Element.prototype.animate = jest.fn().mockReturnValue({
		finished: Promise.resolve(),
		cancel: jest.fn(),
		play: jest.fn(),
		pause: jest.fn(),
		reverse: jest.fn(),
		finish: jest.fn(),
		onfinish: null,
		oncancel: null,
		onremove: null,
		currentTime: 0,
		effect: null,
		id: '',
		pending: false,
		playState: 'finished',
		playbackRate: 1,
		ready: Promise.resolve(),
		replaceState: 'active',
		startTime: 0,
		timeline: null,
		commitStyles: jest.fn(),
		persist: jest.fn(),
		updatePlaybackRate: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	} as unknown as Animation);
}
