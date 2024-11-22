import { useLocation } from 'wouter'
import { LayoutLink } from './link'
import { RxDashboard } from 'react-icons/rx'
import { hasRoles } from '../../utils/roles'
import { HiOutlineUsers } from 'react-icons/hi2'
import { TiDocumentText } from 'react-icons/ti'
import { IoIosList } from 'react-icons/io'
import { MdOutlineInventory2 } from 'react-icons/md'
import { FiShoppingBag } from 'react-icons/fi'
import { PiUsersFour } from 'react-icons/pi'
import { Tooltip } from 'flowbite-react'

export function Sidebar({ employee, collapsed }) {
  const [location] = useLocation()

  const isActivePath = (path) => location === path

  const renderLink = (to, icon, label) => {
    const link = (
      <LayoutLink
        isActive={isActivePath(to)}
        to={to}
      >
        {icon}
        {!collapsed && label}
      </LayoutLink>
    )

    return collapsed ? (
      <Tooltip
        content={label}
        style='light'
        placement='right'
        className='z-50'
      >
        {link}
      </Tooltip>
    ) : (
      link
    )
  }

  return (
    <aside
      className={`flex ${collapsed ? 'w-[80px]' : 'w-[260px]'} flex-col shadow-sm dark:border-neutral-700 dark:bg-[#171717]`}
    >
      <div className='flex h-full flex-col justify-between border-x border-l border-r pt-4 dark:border-neutral-700'>
        <nav className='flex flex-col gap-2 text-sm'>
          {renderLink(
            '/home',
            <RxDashboard className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
            'Inicio',
          )}
          {hasRoles(employee, 'admin', 'seller') &&
            renderLink(
              '/bills/create',
              <TiDocumentText className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
              'Nueva Factura',
            )}
          {hasRoles(employee, 'admin', 'seller') &&
            renderLink(
              '/bills',
              <IoIosList className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
              'Facturas',
            )}
          {hasRoles(employee, 'admin', 'seller') &&
            renderLink(
              '/products',
              <MdOutlineInventory2 className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
              'Productos',
            )}
          {hasRoles(employee, 'admin') &&
            renderLink(
              '/create-purchase',
              <FiShoppingBag className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
              'Órden de compra',
            )}
          {hasRoles(employee, 'admin') &&
            renderLink(
              '/suppliers',
              <PiUsersFour className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
              'Proveedores',
            )}
          {hasRoles(employee, 'admin') &&
            renderLink(
              '/users',
              <HiOutlineUsers className='h-6 w-5 text-neutral-600 dark:text-neutral-300' />,
              'Administración',
            )}
        </nav>
      </div>
    </aside>
  )
}
