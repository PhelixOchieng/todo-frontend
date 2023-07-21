import { twMerge } from "tailwind-merge"

const base =
  'bg-primary text-on-primary rounded-md text-sm px-4 py-3 hover:bg-primary-dark transition-colors disabled:bg-black/30 disabled:cursor-not-allowed'

const text = twMerge(base, 'bg-primary/10 text-primary-dark hover:bg-primary/20 disabled:bg-transparent disabled:text-black/50')
const textIcon = twMerge(text, 'flex items-center gap-x-3 [&_svg]:w-5')

const icon = twMerge(text, 'rounded-full p-3 [&_svg]:w-5')

export const variants = {
  base,
	text,
  icon,
	'text-icon': textIcon,
}
