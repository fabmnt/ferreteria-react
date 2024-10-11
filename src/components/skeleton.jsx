export function Skeleton(props) {
  return (
    <div
      className='flex animate-pulse space-x-4'
      {...props}
    >
      <div className='flex-1 p-1'>
        <div className='h-7 w-full rounded-lg bg-neutral-200' />
      </div>
    </div>
  )
}
