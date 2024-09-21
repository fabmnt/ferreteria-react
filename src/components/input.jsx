export function Input({ ...props }) {
  return (
    <input
      {...props}
      className='w-full rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-800 placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
    />
  )
}
