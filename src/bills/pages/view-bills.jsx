import { Button } from 'flowbite-react'
import { IoIosAdd } from 'react-icons/io'
import { Link } from 'wouter'
import { BillsTable } from '../components/bills-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { deleteBill, getBills } from '../../services/bills'
import { toast } from 'sonner'
import { DeleteBillWarning } from '../components/delete-bill-warning'
import { BillFilters } from '../components/bill-filters'

export function ViewBillsPage() {
  const [bills, setBills] = useState([])
  const [billIdToDelete, setBillIdToDelete] = useState(null)
  const [showDeleteBillWarning, setShowDeleteBillWarning] = useState(false)
  const [isDeletingBill, setIsDeletingBill] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [billFilters, setBillFilters] = useState({
    customer: '',
    paymentMethod: '',
    ID: '',
    seller: '',
  })
  const originalBills = useRef([])

  useEffect(() => {
    setIsLoading(true)
    getBills()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setBills(data)
        originalBills.current = data
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const customerFullName = `${bill.customers.name} ${bill.customers.last_name}`
      const isCustomerValid =
        billFilters.customer === '' ||
        customerFullName.toLowerCase().includes(billFilters.customer.toLowerCase())
      const isPaymentMethodValid =
        billFilters.paymentMethod === '' || bill.payment_method === billFilters.paymentMethod
      const isIDValid = billFilters.ID === '' || bill.id === +billFilters.ID
      const employeeFullName = `${bill.employees.name} ${bill.employees.last_name}`
      const isSellerValid =
        billFilters.seller === '' ||
        employeeFullName.toLowerCase().includes(billFilters.seller.toLowerCase())

      return isCustomerValid && isPaymentMethodValid && isIDValid && isSellerValid
    })
  }, [bills, billFilters])

  const sellers = useMemo(() => {
    const repeatedSellers = bills.map(
      (bill) => `${bill.employees.name} ${bill.employees.last_name}`,
    )

    return [...new Set(repeatedSellers)]
  }, [bills])

  const handleShowDeleteWarning = (billId) => {
    setBillIdToDelete(billId)
    setShowDeleteBillWarning(true)
  }

  const handleDeleteBill = async (billId) => {
    setIsDeletingBill(true)

    try {
      const { error } = await deleteBill(billId)
      if (error) {
        throw new Error(error.message)
      }
      setBills((prevBills) => prevBills.filter((bill) => bill.id !== billId))
      toast.success('La factura se eliminó correctamente.')
    } catch (error) {
      toast.error('Ocurrió un error al eliminar la factura.')
    } finally {
      setBillIdToDelete(null)
      setShowDeleteBillWarning(false)
      setIsDeletingBill(false)
    }
  }

  const handleUpdateFilters = (newFilter) => {
    setBillFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilter,
    }))
  }

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
        <div className=''>
          <BillFilters
            sellers={sellers}
            billFilters={billFilters}
            onUpdateFilters={handleUpdateFilters}
          />
          <div className='mt-2'>
            <BillsTable
              bills={filteredBills}
              isLoading={isLoading}
              onDeleteBill={handleShowDeleteWarning}
            />
          </div>
        </div>
      </div>
      <DeleteBillWarning
        billId={billIdToDelete}
        show={showDeleteBillWarning}
        close={() => setShowDeleteBillWarning(false)}
        isDeleting={isDeletingBill}
        onDeleteBill={handleDeleteBill}
      />
    </div>
  )
}
