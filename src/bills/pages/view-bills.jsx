import { Button } from 'flowbite-react'
import { IoIosAdd } from 'react-icons/io'
import { Link } from 'wouter'
import { BillsTable } from '../components/bills-table'
import { useEffect, useState } from 'react'
import { getBills } from '../../services/bills'
import { toast } from 'sonner'

export function ViewBillsPage() {
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getBills()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setBills(data)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div>
      <div className='flex justify-between'>
        <div className='mb-4'>
          <h2 className='text-2xl font-semibold'>Facturas</h2>
          <p className='text-sm text-neutral-600'>Todas las facturas registradas en el sistema.</p>
        </div>
        <div>
          <Button
            color='light'
            as={Link}
            to='/bills/create'
          >
            <div className='flex items-center gap-1'>
              Nueva factura
              <IoIosAdd size='24' />
            </div>
          </Button>
        </div>
      </div>
      <div className='rounded border bg-white'>
        <BillsTable
          bills={bills}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
