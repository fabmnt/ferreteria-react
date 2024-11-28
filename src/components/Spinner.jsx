import { cn } from '../utils/cn'

export function Spinner({ contrastClassName, className }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      className={cn('animate-spin text-gray-300', className)}
      viewBox='0 0 64 64'
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='5'
        d='M32 3a29 29 0 110 58 29 29 0 010-58h0z'
      />
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='5'
        d='M32 3a29 29 0 0127.576 37.976'
        className={cn('text-white', contrastClassName)}
      />
    </svg>
  )
}
