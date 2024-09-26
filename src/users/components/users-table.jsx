import { AiOutlineDelete } from 'react-icons/ai'
import { Badge } from '../../components/badge'
import { Button, Dropdown, Modal } from 'flowbite-react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { verifyEmployee } from '../../services/users'
import { deleteUser, logout } from '../../services/auth'
import { useSessionStore } from '../../store/session'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useState } from 'react'
import { Spinner } from '../../components/spinner'

export function UsersTable({ isLoading, employees, revalidate }) {
  const [openModal, setOpenModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const session = useSessionStore((state) => state.session)

  const rolesTranslated = {
    admin: 'Administrador',
    seller: 'Vendedor',
    guest: 'Invitado',
  }

  const handleVerifyEmployee = async (employeeId) => {
    const { error } = await verifyEmployee(employeeId)

    if (error) {
      return
    }

    revalidate()
  }

  const handleDeleteEmployee = async (userId) => {
    setIsDeleting(true)
    const { error } = await deleteUser(userId)

    if (error) {
      setIsDeleting(false)
      setOpenModal(false)
      revalidate()
      return
    }

    if (userId === session.user.id) {
      await logout()
    }

    setIsDeleting(false)
    setOpenModal(false)
    revalidate()
  }

  const handleShowDeleteModal = (employeeId) => {
    setUserIdToDelete(employeeId)
    setOpenModal(true)
  }

  return (
    <>
      <table className='w-full table-fixed text-left text-sm'>
        <thead className='border-b text-xs'>
          <tr className='[&>th]:h-10 [&>th]:px-2 [&>th]:font-normal [&>th]:text-neutral-600'>
            <th className='w-16 pl-4'>#</th>
            <th className='w-[15ch]'>Nombres</th>
            <th className='w-[15ch]'>Apellidos</th>
            <th className='w-[22ch]'>Correo</th>
            <th className='w-32'>Estado</th>
            <th className='w-28'>Rol</th>
            <th className='w-28'>Fecha de creación</th>
            <th className='w-28'>Último inicio de sesión</th>
            <th className='w-20'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className='h-16 pl-4'>
                  <div className='h-6 w-12 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 w-24 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 w-24 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 animate-pulse rounded-lg bg-gray-200' />
                </td>
                <td className='h-16'>
                  <div className='h-6 w-16 animate-pulse rounded-lg bg-gray-200' />
                </td>
              </tr>
            ))}

          {!isLoading &&
            employees.map((employee) => (
              <tr
                key={employee.id}
                className='border-y [&>td]:h-16 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:px-2 [&>td]:align-middle'
              >
                <td className='pl-4'>
                  <span className='inline-block rounded bg-gray-200 px-2.5 py-1 text-gray-800'>
                    #{employee.id}
                  </span>
                </td>
                <td>
                  {employee.name}{' '}
                  {session.user.id === employee.user_id && (
                    <span className='font-semibold text-zinc-700'>(Tú)</span>
                  )}
                </td>
                <td>{employee.last_name}</td>
                <td className=''>{employee.email}</td>
                <td>
                  {employee.verified ? (
                    <Badge variant='success'>Verificado</Badge>
                  ) : (
                    <Badge variant='danger'>No verificado</Badge>
                  )}
                </td>
                <td>{rolesTranslated[employee.roles.role]}</td>
                <td>{new Date(employee.created_at).toDateString()}</td>
                <td className=''>{new Date(session.user.last_sign_in_at).toDateString()}</td>
                <td className=''>
                  <div className='flex gap-4'>
                    <button
                      className='flex items-center gap-2 text-red-700 underline-offset-2 hover:underline'
                      onClick={() => handleShowDeleteModal(employee.user_id)}
                    >
                      <AiOutlineDelete className='h-6 w-5 text-red-700' />
                    </button>
                    <Dropdown
                      size='sm'
                      inline
                      renderTrigger={() => (
                        <button>
                          <BsThreeDotsVertical className='h-6 w-5' />
                        </button>
                      )}
                    >
                      {!employee.verified && (
                        <Dropdown.Item onClick={() => handleVerifyEmployee(employee.id)}>
                          Verificar
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item>Editar rol</Dropdown.Item>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        show={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              ¿Estás seguro que deseas eliminar este usuario?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='gray'
                onClick={() => {
                  setOpenModal(false)
                  setUserIdToDelete(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                color='failure'
                onClick={() => {
                  handleDeleteEmployee(userIdToDelete)
                }}
              >
                <div className='flex items-center gap-2'>
                  {isDeleting ? 'Eliminando' : 'Eliminar'}
                  {isDeleting && <Spinner />}
                </div>
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
