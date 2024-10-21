import { HiOutlineUsers } from 'react-icons/hi2'
import { RxDashboard } from 'react-icons/rx'
import { TiDocumentText } from 'react-icons/ti'
import { useLocation } from 'wouter'
import { useSessionStore } from '../store/session'
import { hasRoles } from '../utils/roles'
import { LayoutLink } from './components/link'
import { useEffect, useState } from 'react'
import { getEmployee } from '../services/users'
import { logout } from '../services/auth'
import { Spinner } from '../components/spinner'
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb'
import { UserDropdown } from './components/user-dropdown'
import { IoIosNotificationsOutline, IoIosHelpCircleOutline, IoIosList } from 'react-icons/io'
import { MdOutlineInventory2 } from 'react-icons/md'
import { FiShoppingBag } from 'react-icons/fi'

export function DashboardLayout({ children }) {
  const session = useSessionStore((state) => state.session)
  const employee = useSessionStore((state) => state.employee)
  const setEmployee = useSessionStore((state) => state.setEmployee)
  const [location, navigate] = useLocation()
  const [loadingApp, setLoadingApp] = useState(true)

  const isActivePath = (path) => location === path

  useEffect(() => {
    if (session == null) {
      return
    }

    getEmployee(session.user.id)
      .then(({ data }) => {
        const [employee] = data
        setEmployee(employee)
        if (employee == null) {
          logout().finally(() => {
            navigate('/login')
            setLoadingApp(false)
          })
          return
        }

        if (employee.verified) {
          setLoadingApp(false)
          return
        }

        logout().finally(() => {
          navigate('/login?not_verified')
          setLoadingApp(false)
        })
      })
      .catch(() => {
        logout().finally(() => {
          navigate('/login')
          setLoadingApp(false)
        })
      })
  }, [session])

  if (loadingApp) {
    return (
      <div className='grid min-h-screen w-full place-content-center'>
        <div className='flex flex-col items-center gap-4'>
          <Spinner className='size-12 text-purple-500' />
          <p className='text-lg font-semibold'>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-[100dvh] w-full flex-col'>
      <div className='flex w-full items-center border'>
        <div className='w-[260px] border-r px-4 pb-6 pt-4'>
          <div className='flex justify-between'>
            <div>
              <h1 className='text-lg font-semibold'>Ferreteria</h1>
              <p className='text-sm text-neutral-600'>Facturación e inventario.</p>
            </div>
            <div>
              <button>
                <TbLayoutSidebarLeftCollapse
                  strokeWidth={1.5}
                  className='h-8 w-7 text-neutral-600'
                />
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-1 justify-between'>
          <div className='ml-12 place-self-center' />
          <div className='mr-12 flex items-center gap-4'>
            <button>
              <IoIosNotificationsOutline className='size-6 text-neutral-700' />
            </button>
            <button>
              <IoIosHelpCircleOutline className='size-6 text-neutral-700' />
            </button>
            {session && employee && (
              <UserDropdown
                employee={employee}
                session={session}
              />
            )}
          </div>
        </div>
      </div>
      <div className='flex h-full flex-grow'>
        <aside className='flex w-[260px] flex-col shadow-sm'>
          <div className='flex h-full flex-col justify-between border pt-4'>
            <nav className='flex flex-col gap-2 text-sm'>
              <LayoutLink
                isActive={isActivePath('/home')}
                to='/home'
              >
                <RxDashboard className='h-6 w-5' />
                Inicio
              </LayoutLink>

              {hasRoles(employee, 'admin') && (
                <LayoutLink
                  isActive={isActivePath('/users')}
                  to='/users'
                >
                  <HiOutlineUsers className='h-6 w-5' />
                  Usuarios
                </LayoutLink>
              )}
              {hasRoles(employee, 'admin', 'seller') && (
                <LayoutLink
                  isActive={isActivePath('/bills/create')}
                  to='/bills/create'
                >
                  <TiDocumentText className='h-6 w-5' />
                  Nueva Factura
                </LayoutLink>
              )}
              {hasRoles(employee, 'admin', 'seller') && (
                <LayoutLink
                  isActive={isActivePath('/bills')}
                  to='/bills'
                >
                  <IoIosList className='h-6 w-5' />
                  Facturas
                </LayoutLink>
              )}
              {hasRoles(employee, 'admin', 'seller') && (
                <LayoutLink
                  isActive={isActivePath('/products')}
                  to='/products'
                >
                  <MdOutlineInventory2 className='h-6 w-5' />
                  Productos
                </LayoutLink>
              )}
              {hasRoles(employee, 'admin') && (
                <LayoutLink
                  isActive={isActivePath('/create-purchase')}
                  to='/create-purchase'
                >
                  <FiShoppingBag className='h-6 w-5' />
                  Órden de compra
                </LayoutLink>
              )}
            </nav>
          </div>
        </aside>
        <div className='flex-1 bg-[#f7f9fb]'>
          <div className='px-12 pt-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}
