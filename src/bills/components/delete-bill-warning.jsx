import { Button, Modal, Spinner } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export function DeleteBillWarning({ show, close, onDeleteBill, isDeleting, billId }) {
  return (
    <Modal
      show={show}
      size='md'
      onClose={() => close()}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className='text-center'>
          <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
          <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
            ¿Estás seguro que deseas eliminar esta factura?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button
              color='gray'
              onClick={() => {
                close()
              }}
            >
              Cancelar
            </Button>
            <Button
              color='failure'
              onClick={() => onDeleteBill(billId)}
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
  )
}
