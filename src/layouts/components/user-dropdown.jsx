import { IoIosArrowDown } from 'react-icons/io'

export function UserDropdown({ employee, session }) {
  return (
    <button className='flex items-center justify-between gap-2 rounded border border-neutral-300 px-4 py-2.5'>
      <span className='inline-block rounded border-neutral-200 bg-neutral-300 p-2.5 text-sm font-bold'>
        {employee.name[0]}
        {employee.last_name[0]}
      </span>
      <div className='text-start'>
        <p className='text-sm font-medium'>
          {employee.name} {employee.last_name}
        </p>
        <p className='text-xs text-neutral-500'>{session?.user.email}</p>
      </div>
      <IoIosArrowDown className='h-4 w-4 text-neutral-500' />
    </button>
  )
}
