import { Button, Select, TextInput } from 'flowbite-react'
import { RiSearchLine } from 'react-icons/ri'

export function BillFilters({ onUpdateFilters, billFilters, sellers }) {
  return (
    <div className='flex justify-between px-2 py-3'>
      <div className='flex gap-2'>
        <TextInput
          value={billFilters.customer}
          onChange={(e) => onUpdateFilters({ customer: e.target.value })}
          placeholder='Buscar por cliente...'
          sizing='sm'
          rightIcon={RiSearchLine}
        />

        <Select
          sizing='sm'
          value={billFilters.paymentMethod}
          onChange={(e) => onUpdateFilters({ paymentMethod: e.target.value })}
        >
          <option value=''>Métodos de pago</option>
          <option value='cash'>Efectivo</option>
          <option value='credit card'>Tarjeta de crédito</option>
          <option value='debit card'>Tarjeta de débito</option>
        </Select>

        <TextInput
          addon='#'
          type='number'
          className='w-32'
          min={1}
          value={billFilters.ID}
          onChange={(e) => onUpdateFilters({ ID: e.target.value })}
          placeholder='Por ID...'
          sizing='sm'
        />

        <Select
          sizing='sm'
          value={billFilters.seller}
          onChange={(e) => onUpdateFilters({ seller: e.target.value })}
        >
          <option value=''>Seleccionar vendedor</option>
          {sellers.map((seller) => (
            <option
              key={seller}
              value={seller}
            >
              {seller}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Button
          color='light'
          className='text-sm'
          size='xs'
          onClick={() => {
            onUpdateFilters({ customer: '', paymentMethod: '', ID: '', seller: '' })
          }}
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
