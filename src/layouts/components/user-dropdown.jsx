import { Dropdown } from 'flowbite-react'
import { IoIosArrowDown } from 'react-icons/io'
import { logout } from '../../services/auth'

export function UserDropdown({ employee, session }) {
  const EmployeeInfo = () => (
    <div className='flex items-center justify-between gap-2 rounded border border-neutral-300 px-4 py-2.5 hover:cursor-pointer'>
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
    </div>
  )

  const handleLogout = () => {
    logout()
  }

  return (
    <Dropdown renderTrigger={EmployeeInfo}>
      <Dropdown.Item onClick={handleLogout}>
        <span>Cerrar sesión</span>
      </Dropdown.Item>
    </Dropdown>
  )
}
