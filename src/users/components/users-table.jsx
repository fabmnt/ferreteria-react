import { AiOutlineDelete } from 'react-icons/ai'
import { Badge } from '../../components/badge'
import { Button, Dropdown, Modal, Select } from 'flowbite-react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
  getEmployee,
  unverifyEmployee,
  updateEmployeeRole,
  verifyEmployee,
} from '../../services/users'
import { deleteUser, logout } from '../../services/auth'
import { useSessionStore } from '../../store/session'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useState } from 'react'
import { Spinner } from '../../components/spinner'
import { toast } from 'sonner'

export function UsersTable({ isLoading, employees, revalidate, roles }) {
  const [openModal, setOpenModal] = useState(false)
  const [openChangeRoleModal, setOpenChangeRoleModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingRole, setIsChangingRole] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [employeeIdToChangeRole, setEmployeeIdToChangeRole] = useState(null)
  const [roleId, setRoleId] = useState(null)
  const session = useSessionStore((state) => state.session)
  const setEmployee = useSessionStore((state) => state.setEmployee)

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
      toast.error('Ocurrió un error al eliminar el usuario, inténtelo más tarde.')
      setIsDeleting(false)
      setOpenModal(false)
      revalidate()
      return
    }

    if (userId === session.user.id) {
      await logout()
    }

    toast.success('Usuario eliminado exitosamente.')
    setIsDeleting(false)
    setOpenModal(false)
    revalidate()
  }

  const handleShowDeleteModal = (employeeId) => {
    setUserIdToDelete(employeeId)
    setOpenModal(true)
  }

  const handleShowChangeRoleModal = async (employeeId, event) => {
    event.preventDefault()
    const roleId = event.target.value
    setEmployeeIdToChangeRole(employeeId)
    setRoleId(roleId)
    setOpenChangeRoleModal(true)
  }

  const handleChangeRole = async () => {
    setIsChangingRole(true)
    const { error } = await updateEmployeeRole(employeeIdToChangeRole, roleId)
    if (error) {
      toast.error('Ocurrió un error al actualizar el rol, inténtelo más tarde.')
      setIsChangingRole(false)
      setOpenChangeRoleModal(false)
      return
    }

    const {
      data: [employee],
    } = await getEmployee(session.user.id)
    toast.success('Rol actualizado exitosamente.')
    setEmployee(employee)
    setIsChangingRole(false)
    setOpenChangeRoleModal(false)
    revalidate()
  }

  const handleUnverifyEmployee = async (employeeId) => {
    const { error } = await unverifyEmployee(employeeId)

    if (error) {
      return
    }

    revalidate()
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
            Array.from({ length: 12 }).map((_, index) => (
              <tr key={index}>
                <td
                  colSpan='9'
                  className='h-16 px-2 align-middle'
                >
                  <div className='flex animate-pulse space-x-4'>
                    <div className='flex-1 p-1'>
                      <div className='h-7 w-full rounded-lg bg-neutral-200' />
                    </div>
                  </div>
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
                <td>
                  <Select
                    value={employee.roles.id}
                    onChange={(e) => handleShowChangeRoleModal(employee.id, e)}
                  >
                    {roles.map((role) => (
                      <option
                        key={role.id}
                        value={role.id}
                      >
                        {rolesTranslated[role.role]}
                      </option>
                    ))}
                  </Select>
                </td>
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
                      {employee.verified && (
                        <Dropdown.Item onClick={() => handleUnverifyEmployee(employee.id)}>
                          Quitar verificado
                        </Dropdown.Item>
                      )}
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

      <Modal
        show={openChangeRoleModal}
        size='md'
        onClose={() => setOpenChangeRoleModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              El rol de este usuario cambiará, ¿estás seguro?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='gray'
                onClick={() => setOpenChangeRoleModal(false)}
              >
                Cancelar
              </Button>
              <Button
                color='blue'
                onClick={handleChangeRole}
              >
                <div className='flex items-center gap-2'>
                  {isChangingRole ? 'Actualizando' : 'Cambiar'}
                  {isChangingRole && <Spinner />}
                </div>
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
