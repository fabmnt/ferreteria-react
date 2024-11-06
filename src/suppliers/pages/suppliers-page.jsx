import { useEffect, useState } from 'react'
import { SuppliersTable } from '../components/suppliers-table'
import { deleteSupplier, getSuppliers } from '../../services/products'
import { toast } from 'sonner'
import { DeleteSupplierWarning } from '../components/delete-supplier-waring'
import { Button } from 'flowbite-react'
import { IoIosAdd } from 'react-icons/io'
import { CreateSupplierModal } from '../components/create-supplier-modal'
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs'

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeletingSupplier, setIsDeletingSupplier] = useState(false)
  const [supplierIdToDelete, setSupplierIdToDelete] = useState(null)
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false)

  useBreadcrumbs({ breadcrumbs: ['Proveedores'] })

  useEffect(() => {
    setIsLoadingSuppliers(true)
    getSuppliers()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setSuppliers(data)
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoadingSuppliers(false)
      })
  }, [])

  const handleShowDeleteModal = (supplierId) => {
    setSupplierIdToDelete(supplierId)
    setShowDeleteModal(true)
  }

  const handleDeleteSupplier = (supplierId) => {
    setIsDeletingSupplier(true)
    deleteSupplier(supplierId)
      .then(({ error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((supplier) => supplier.id !== supplierId),
        )
        toast.success('Proveedor eliminado correctamente.')
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsDeletingSupplier(false)
        setShowDeleteModal(false)
        setSupplierIdToDelete(null)
      })
  }

  const handleOnCreatedSupplier = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier])
    setShowCreateSupplierModal(false)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <div className='mb-4 flex flex-col'>
          <h2 className='text-2xl font-semibold'>Proveedores</h2>
          <p className='text-sm text-neutral-600'>Listado de proveedores.</p>
        </div>
        <div>
          <Button
            color='light'
            onClick={() => setShowCreateSupplierModal(true)}
          >
            <div className='flex items-center gap-1'>
              <span>Nuevo proveedor</span> <IoIosAdd size='24' />
            </div>
          </Button>
        </div>
      </div>

      <section className='rounded border bg-white p-2'>
        <SuppliersTable
          suppliers={suppliers}
          isLoading={isLoadingSuppliers}
          onDeleteSupplier={handleShowDeleteModal}
        />
      </section>

      {supplierIdToDelete != null && (
        <DeleteSupplierWarning
          show={showDeleteModal}
          close={() => setShowDeleteModal(false)}
          isDeleting={isDeletingSupplier}
          supplierId={supplierIdToDelete}
          onDeleteSupplier={handleDeleteSupplier}
        />
      )}

      <CreateSupplierModal
        opened={showCreateSupplierModal}
        close={() => setShowCreateSupplierModal(false)}
        onCreateSupplier={handleOnCreatedSupplier}
      />
    </div>
  )
}
