import { useEffect, useState } from 'react'
import { getCustomerByPhone, getCustomers } from '../../services/customers'
import { RiSearchLine } from 'react-icons/ri'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Input } from '../../components/input'

export function ClientInformation({ updateCurrentCustomer, currentCustomer }) {
  const [existingCustomer, setExistingCustomer] = useState(true)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [lastCustomers, setLastCustomers] = useState([])

  useEffect(() => {
    getCustomers().then(({ data }) => {
      if (data == null) {
        return
      }
      const sortedCustomers = [...data].sort((a, b) => new Date(b.last_buy) - new Date(a.last_buy))
      setLastCustomers(sortedCustomers)
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
    e.preventDefault()
    const form = new FormData(e.target)
    const phone = form.get('phone')
    const { data, error } = await getCustomerByPhone(phone)
    if (error) {
      return
    }
    const [customer] = data

    if (customer == null) {
      return
    }

    updateCurrentCustomer(customer)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <h4 className='mb-2 font-semibold'>Información del cliente</h4>
        <label className='inline-flex cursor-pointer items-center'>
          <input
            type='checkbox'
            checked={existingCustomer}
            className='peer sr-only'
            onChange={handleExistingCustomerChange}
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
          <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Cliente existente
          </span>
        </label>
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
                <Input
                  required
                  name='phone'
                  type='tel'
                  maxLength='8'
                  minLength='8'
                  placeholder='88880000'
                />
                <button type='submit'>
                  <RiSearchLine className='size-6 text-gray-600' />
                </button>
              </div>
            </label>
          </form>
        )}
        {currentCustomer && (
          <div className='col-span-2 mt-2'>
            <div className='flex items-center justify-between'>
              <p className='inline-flex items-center gap-1 text-sm'>
                {`${currentCustomer.name} ${currentCustomer.last_name}, teléfono: ${currentCustomer.phone}`}
                <FaCheckCircle className='size-4 text-green-600' />
              </p>
              {showCustomerDetails ? (
                <button
                  onClick={() => setShowCustomerDetails((prev) => !prev)}
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  <IoIosArrowUp className='h-4 w-6' /> Ocultar detalles
                </button>
              ) : (
                <button
                  onClick={() => setShowCustomerDetails((prev) => !prev)}
                  className='flex items-center gap-1 text-sm font-medium'
                >
                  <IoIosArrowDown className='h-4 w-6' /> Ver detalles
                </button>
              )}
            </div>
          </div>
        )}

        {!showCustomerDetails && existingCustomer && (
          <table className='relative col-span-2 mt-4 max-h-[120px] w-full table-auto text-left text-sm'>
            <caption className='mb-2 text-start text-sm'>Últimos clientes</caption>
            <thead className='sticky top-0 z-10 border-b'>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Última compra</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lastCustomers.map((customer) => (
                <tr
                  className='hover:cursor-pointer [&>td]:h-10 [&>td]:align-middle'
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
        )}
        <form
          className={`mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 ${!existingCustomer || showCustomerDetails ? 'block' : 'hidden'}`}
        >
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Nombres:</span>
            <Input
              id='customer-name'
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
              required
              type='text'
              className='rounded border px-2 py-1 text-sm font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500'
              placeholder='Montoya'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Correo (opcional):</span>
            <Input
              disabled={currentCustomer}
              id='customer-email'
              type='email'
              className='rounded border px-2 py-1 text-sm font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500'
              placeholder='correo@correo.com'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className=''>Teléfono:</span>
            <Input
              disabled={currentCustomer}
              id='customer-phone'
              type='tel'
              maxLength='8'
              minLength='8'
              className='rounded border px-2 py-1 text-sm font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500'
              placeholder='88880000'
            />
          </label>
          <label className='col-span-2 flex flex-col gap-1 text-sm'>
            <span className=''>Dirección:</span>
            <textarea
              disabled={currentCustomer}
              id='customer-address'
              placeholder='Managua, Nicaragua.'
              className='rounded border px-2 py-1 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
            />
          </label>
        </form>
      </div>
    </div>
  )
}
