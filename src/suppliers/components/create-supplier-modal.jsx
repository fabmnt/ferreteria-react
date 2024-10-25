import { Button, Label, Modal, Select, Spinner, Textarea, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { createSupplier, getCategories } from '../../services/products'
import { toast } from 'sonner'

export function CreateSupplierModal({ opened, close, onCreateSupplier }) {
  const [categories, setCategories] = useState([])
  const [isCreatingNewSupplier, setIsCreatingNewSupplier] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  useEffect(() => {
    if (opened === false) {
      return
    }

    setIsLoadingCategories(true)
    getCategories()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setCategories(data ?? [])
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoadingCategories(false)
      })
  }, [opened])

  const handleSubmit = async (e) => {
    setIsCreatingNewSupplier(true)
    e.preventDefault()
    const formData = new FormData(e.target)
    const supplier = {
      name: formData.get('supplier-name'),
      phone: formData.get('supplier-phone'),
      category_id: +formData.get('supplier-category'),
      email: formData.get('supplier-email'),
      address: formData.get('supplier-address'),
    }

    const { data, error } = await createSupplier(supplier)
    if (error) {
      toast.error(error.message)
      return
    }

    setIsCreatingNewSupplier(false)
    toast.success('Proveedor creado correctamente.')
    onCreateSupplier(data[0])
  }

  return (
    <Modal
      size='5xl'
      show={opened}
      onClose={() => close()}
    >
      <Modal.Header>Nuevo producto</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-4 gap-4'>
            <Label className='col-span-2'>
              <span>Nombre</span>
              <TextInput
                required
                className='mt-2'
                name='supplier-name'
                placeholder='Proveedor'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Teléfono</span>
              <TextInput
                maxLength={8}
                minLength={8}
                required
                className='mt-2'
                name='supplier-phone'
                placeholder='########'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Categoría</span>
              {isLoadingCategories ? (
                <div className='mt-2 h-10 w-full animate-pulse rounded-lg bg-neutral-200' />
              ) : (
                <Select
                  required
                  name='supplier-category'
                  className='mt-2'
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Select>
              )}
            </Label>
            <Label className='col-span-2'>
              <span>Correo</span>
              <TextInput
                name='supplier-email'
                className='mt-2'
                placeholder='correo@correo.com'
              />
            </Label>

            <Label className='col-span-2'>
              <span>Dirección</span>
              <Textarea
                required
                name='supplier-address'
                className='mt-2'
                placeholder='Chinandega, Nicaragua'
              />
            </Label>
            <div className='col-start-4 mt-4 justify-self-end'>
              <Button
                type='submit'
                color='blue'
              >
                <div className='flex items-center gap-2'>
                  {isCreatingNewSupplier ? 'Creando' : 'Crear proveedor'}
                  {isCreatingNewSupplier && <Spinner />}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
