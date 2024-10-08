import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { RiSearchLine } from 'react-icons/ri'
import { Input } from '../../components/input'
import { createCustomer, getCustomerByPhone, getCustomers } from '../../services/customers'

export function ClientInformation({ updateCurrentCustomer, currentCustomer }) {
  const [existingCustomer, setExistingCustomer] = useState(true)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false)
  const [lastCustomers, setLastCustomers] = useState([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)

  useEffect(() => {
    setIsLoadingCustomers(true)
    getCustomers()
      .then(({ data }) => {
        if (data == null) {
          return
        }
        const sortedCustomers = [...data]
          .sort((a, b) => new Date(b.last_buy) - new Date(a.last_buy))
          .slice(0, 5)
        setLastCustomers(sortedCustomers)
      })
      .finally(() => {
        setIsLoadingCustomers(false)
      })
  }, [])

  useEffect(() => {
    if (currentCustomer) {
      const nameInput = document.getElementById('customer-name')
      const lastNameInput = document.getElementById('customer-last-name')
      const emailInput = document.getElementById('customer-email')
      const phoneInput = document.getElementById('customer-phone')
      const addressInput = document.getElementById('customer-address')

      nameInput.value = currentCustomer.name
      lastNameInput.value = currentCustomer.last_name
      emailInput.value = currentCustomer.email ?? ''
      phoneInput.value = currentCustomer.phone
      addressInput.value = currentCustomer.address
    } else {
      const nameInput = document.getElementById('customer-name')
      const lastNameInput = document.getElementById('customer-last-name')
      const emailInput = document.getElementById('customer-email')
      const phoneInput = document.getElementById('customer-phone')
      const addressInput = document.getElementById('customer-address')

      nameInput.value = ''
      lastNameInput.value = ''
      emailInput.value = ''
      phoneInput.value = ''
      addressInput.value = ''
    }
  }, [currentCustomer])

  const handleExistingCustomerChange = (e) => {
    const checked = e.target.checked
    if (!checked) {
      updateCurrentCustomer(null)
    } else {
      setShowCustomerDetails(false)
    }

    setExistingCustomer(checked)
  }

  const handleSearchCustomer = async (e) => {
    setIsSearchingCustomer(true)
    e.preventDefault()
    const form = new FormData(e.target)
    const phone = form.get('phone')
    const { data, error } = await getCustomerByPhone(phone)
    if (error) {
      setIsSearchingCustomer(false)
      return
    }
    const [customer] = data

    if (customer == null) {
      setIsSearchingCustomer(false)
      return
    }

    updateCurrentCustomer(customer)
    setIsSearchingCustomer(false)
  }

  const handleSubmitCreateCustomer = async (e) => {
    e.preventDefault()
    setIsCreatingCustomer(true)
    const createCustomerForm = new FormData(e.target)
    const name = createCustomerForm.get('customer-name')
    const customerLastName = createCustomerForm.get('customer-last-name')
    const email = createCustomerForm.get('customer-email')
    const phone = createCustomerForm.get('customer-phone')
    const address = createCustomerForm.get('customer-address')
    const newCustomer = {
      name,
      last_name: customerLastName,
      phone,
      address,
    }
    const isValidEmail = email != null && email.trim().length > 5

    if (isValidEmail) {
      newCustomer.email = email
    }

    const { data, error } = await createCustomer(newCustomer)

    setIsCreatingCustomer(false)
    e.target.reset()

    if (error) {
      return
    }
    const [customer] = data

    updateCurrentCustomer(customer)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <h4 className='mb-2 font-semibold'>Información del cliente</h4>
        <div className='flex flex-col items-end'>
          <label className='inline-flex cursor-pointer items-center'>
            <input
              type='checkbox'
              checked={existingCustomer}
              className='peer sr-only'
              onChange={handleExistingCustomerChange}
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
          </label>
          <Label>{existingCustomer ? 'Existente' : 'Nuevo'}</Label>
        </div>
      </div>
      <div className=''>
        {existingCustomer && (
          <form
            className='mt-2'
            onSubmit={handleSearchCustomer}
          >
            <label className='flex flex-col gap-1 text-sm'>
              <span className=''>Buscar por teléfono:</span>
              <div className='flex gap-1'>
                <TextInput
                  sizing='sm'
                  className='w-full'
                  rightIcon={isSearchingCustomer ? Spinner : RiSearchLine}
                  required
                  name='phone'
                  type='tel'
                  maxLength='8'
                  minLength='8'
                  placeholder='########'
                />
              </div>
            </label>
          </form>
        )}
        {!showCustomerDetails && existingCustomer && (
          <div className='scroll-bar mb-4 mt-2 max-h-[180px] overflow-y-auto scroll-smooth'>
            <table className='relative col-span-2 w-full table-fixed text-left text-sm'>
              <thead className='sticky text-xs'>
                <tr className='[&>th]:sticky [&>th]:top-0 [&>th]:z-20 [&>th]:h-10 [&>th]:border-b [&>th]:bg-white [&>th]:font-normal [&>th]:text-neutral-600'>
                  <th className='w-[80px]'>Nombre</th>
                  <th className='w-[80px]'>Apellido</th>
                  <th className='w-[200px]'>Correo</th>
                  <th>Teléfono</th>
                  <th>Última compra</th>
                  <th className='w-[25px]' />
                </tr>
              </thead>
              <tbody>
                {isLoadingCustomers &&
                  Array.from({ length: 12 }).map((_, index) => (
                    <tr key={index}>
                      <td
                        colSpan='6'
                        className='h-10 align-middle'
                      >
                        <div className='flex animate-pulse'>
                          <div className='flex-1'>
                            <div className='h-7 w-full rounded-lg bg-neutral-200' />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                {lastCustomers.map((customer) => (
                  <tr
                    className='hover:cursor-pointer [&>td]:h-10 [&>td]:overflow-clip [&>td]:text-ellipsis [&>td]:border-b [&>td]:align-middle'
                    key={customer.id}
                    onClick={() => updateCurrentCustomer(customer)}
                  >
                    <td>{customer.name}</td>
                    <td>{customer.last_name}</td>
                    <td>{customer.email ?? '-'} </td>
                    <td>{customer.phone}</td>
                    <td>{new Date(customer?.last_buy).toDateString()}</td>
                    <td>
                      <input
                        checked={currentCustomer?.id === customer.id}
                        type='radio'
                        name='customer'
                        onChange={() => updateCurrentCustomer(customer)}
                        className='rounded-full border px-2 py-1 text-xs'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <form
          onSubmit={handleSubmitCreateCustomer}
          className={`mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 ${!existingCustomer || showCustomerDetails ? 'block' : 'hidden'}`}
        >
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Nombres:</span>
            <Input
              id='customer-name'
              name='customer-name'
              required
              disabled={currentCustomer}
              type='text'
              placeholder='Fabian'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Apellidos:</span>
            <Input
              disabled={currentCustomer}
              id='customer-last-name'
              name='customer-last-name'
              required
              type='text'
              placeholder='Montoya'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Correo (opcional):</span>
            <Input
              disabled={currentCustomer}
              id='customer-email'
              name='customer-email'
              type='email'
              placeholder='correo@correo.com'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Teléfono:</span>
            <Input
              disabled={currentCustomer}
              id='customer-phone'
              name='customer-phone'
              type='tel'
              maxLength='8'
              minLength='8'
              placeholder='88880000'
            />
          </label>
          <label className='col-span-2 flex flex-col gap-1 text-sm'>
            <span className=''>Dirección:</span>
            <textarea
              disabled={currentCustomer}
              id='customer-address'
              name='customer-address'
              placeholder='Managua, Nicaragua.'
              className='rounded border border-zinc-300 px-2 py-1 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
            />
          </label>
          {!existingCustomer && (
            <div className='col-span-2 flex justify-end'>
              <Button
                type='submit'
                size='sm'
                color='light'
              >
                <div className='flex items-center gap-2'>
                  {isCreatingCustomer ? 'Guardando' : 'Guardar'}
                  {isCreatingCustomer && (
                    <Spinner
                      className=''
                      size='sm'
                    />
                  )}
                </div>
              </Button>
            </div>
          )}
        </form>
      </div>
      <div>
        {currentCustomer ? (
          <div className='col-span-2 mt-2'>
            <div className='flex items-center justify-between'>
              <p className='inline-flex items-center gap-1 text-sm'>
                Cliente seleccionado:{' '}
                {`${currentCustomer.name} ${currentCustomer.last_name}, teléfono: ${currentCustomer.phone}`}
                .
                <FaCheckCircle className='size-4 text-green-600' />
              </p>
              {existingCustomer && (
                <button
                  onClick={() => setShowCustomerDetails((prev) => !prev)}
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  {showCustomerDetails ? <>Ocultar detalles</> : <>Ver detalles</>}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className='text-sm text-neutral-600'>Seleciona o crea un nuevo cliente.</p>
        )}
      </div>
    </div>
  )
}
