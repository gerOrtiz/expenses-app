'use client';
import { twMerge } from 'tailwind-merge';

type TextVariant = 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'label' | 'small';

interface TextProps {
	variant: TextVariant;
	children: React.ReactNode;
	className?: string;
	id?: string;
}

const variantStyles: Record<TextVariant, string> = {
	h2: 'text-3xl font-bold text-blue-800',
	h3: 'text-2xl font-bold text-blue-800',
	h4: 'text-xl font-semibold text-blue-700',
	h5: 'text-lg font-semibold text-blue-700',
	h6: 'text-base font-semibold text-blue-700',
	body: 'text-base font-normal text-blue-gray-700',
	label: 'text-xs lg:text-sm font-normal text-blue-gray-600',
	small: 'text-[11px] lg:text-xs font-normal text-blue-gray-600',
};

const variantElements: Record<TextVariant, keyof JSX.IntrinsicElements> = {
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	body: 'p',
	label: 'span',
	small: 'span',
};

export const Text = ({ variant, children, className, id }: TextProps) => {
	const Tag = variantElements[variant];
	return (
		<Tag className={twMerge(variantStyles[variant], className)} id={id}>
			{children}
		</Tag>
	);
};
