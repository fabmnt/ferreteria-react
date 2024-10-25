import { Button, Label, Modal, Select, Spinner, Textarea, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { createProduct, getSuppliers } from '../../services/products'
import { toast } from 'sonner'

export function CreateProductModal({ opened, close, categories, onCreateProduct }) {
  const [isCreatingNewPRoduct, setIsCreatingNewProduct] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false)

  useEffect(() => {
    if (opened === false) {
      return
    }
    setIsLoadingSuppliers(true)
    getSuppliers()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message)
        }

        setSuppliers(data)
      })
      .catch(() => {
        toast.error('Ocurrió un error al obtener los proveedores, inténtelo más tarde.')
      })
      .finally(() => {
        setIsLoadingSuppliers(false)
      })
  }, [opened])

  const handleSubmit = (e) => {
    setIsCreatingNewProduct(true)
    e.preventDefault()
    const form = new FormData(e.target)
    const name = form.get('product-name').trim()
    const brand = form.get('product-brand').trim()
    const price = +form.get('product-price').trim()
    const cost = +form.get('product-cost').trim()
    const stock = +form.get('product-stock').trim()
    const discount = +form.get('product-discount').trim() || 0
    const category = form.get('product-category').trim()
    const description = form.get('product-description').trim()
    const supplier = form.get('product-supplier').trim()

    const newProduct = {
      name,
      brand,
      price,
      cost,
      stock,
      discount,
      category_id: category,
      description,
      supplier_id: supplier,
    }

    createProduct(newProduct)
      .then(({ error }) => {
        if (error) {
          throw new Error(error.message)
        }
        toast.success('Producto creado exitosamente.')
        onCreateProduct()
      })
      .catch(() => {
        toast.error('Ocurrió un error al crear el producto, inténtelo más tarde.')
      })
      .finally(() => {
        e.target.reset()
        setIsCreatingNewProduct(false)
        close()
      })
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
                name='product-name'
                placeholder='Nombre del producto'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Marca</span>
              <TextInput
                required
                className='mt-2'
                name='product-brand'
                placeholder='Marca del producto'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Categoría</span>
              <Select
                required
                name='product-category'
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
            </Label>
            <Label className='col-span-1'>
              <span>Precio de venta</span>
              <TextInput
                min={1}
                step={0.01}
                required
                name='product-price'
                type='number'
                className='mt-2'
                placeholder='1'
                addon='C$'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Precio de costo</span>
              <TextInput
                min={1}
                step={0.01}
                required
                name='product-cost'
                type='number'
                className='mt-2'
                placeholder='1'
                addon='C$'
              />
            </Label>
            <TextInput
              hidden
              required
              name='product-stock'
              type='number'
              className='mt-2 hidden'
              placeholder='1'
              value={0}
            />
            <Label className='col-span-1'>
              <span>Descuento</span>
              <TextInput
                required
                min={0}
                max={100}
                name='product-discount'
                addon='%'
                type='number'
                className='mt-2'
                placeholder='0'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Proveedor</span>
              {isLoadingSuppliers && (
                <div className='mt-2 h-10 w-full animate-pulse rounded-lg bg-neutral-200' />
              )}
              {suppliers.length > 0 && !isLoadingSuppliers && (
                <Select
                  name='product-supplier'
                  className='mt-2'
                >
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name}
                    </option>
                  ))}
                </Select>
              )}
            </Label>

            <Label className='col-span-4'>
              <span>Descripción</span>
              <Textarea
                required
                name='product-description'
                className='mt-2'
                placeholder='Descripción del producto'
              />
            </Label>
            <div className='col-start-4 justify-self-end'>
              <Button
                type='submit'
                color='blue'
              >
                <div className='flex items-center gap-2'>
                  {isCreatingNewPRoduct ? 'Creando' : 'Crear producto'}
                  {isCreatingNewPRoduct && <Spinner />}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
