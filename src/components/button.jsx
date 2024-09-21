export function Button({ children, variant = 'primary', ...props }) {
  let variantClassnames

  if (variant === 'primary') {
    variantClassnames = 'bg-purple-500 hover:bg-purple-600 focus-visible:ring-purple-500 text-white'
  } else if (variant === 'secondary') {
    variantClassnames = 'bg-white border border-zinc-300 text-zinc-800'
  }

  return (
    <button
      {...props}
      className={`mt-8 flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-60 ${variantClassnames}`}
    >
      {children}
    </button>
  )
}
