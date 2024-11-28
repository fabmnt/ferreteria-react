import { Button, Label, Modal, Select, Spinner, Textarea, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getSuppliers, updateProduct } from '../../services/products'
import { sortKeys } from '../../utils/utils'

export function EditProductModal({ opened, close, categories, product, onUpdateProduct }) {
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)
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
    setIsUpdatingProduct(true)
    e.preventDefault()
    const id = product.id
    const form = new FormData(e.target)
    const name = form.get('product-name').trim()
    const brand = form.get('product-brand').trim()
    const cost = +form.get('product-cost').trim()
    const price = +form.get('product-price').trim()
    const stock = +form.get('product-stock').trim()
    const discount = +form.get('product-discount').trim() || 0
    const category = +form.get('product-category').trim()
    const description = form.get('product-description').trim()
    const supplier = +form.get('product-supplier').trim()

    const updatedProduct = {
      id,
      cost,
      name,
      brand,
      price,
      stock,
      discount,
      category_id: category,
      description,
      supplier_id: supplier,
    }

    const updatedProductAsJSON = JSON.stringify(
      sortKeys({
        ...updatedProduct,
        created_at: product.created_at,
      }),
    )
    delete product.suppliers
    const productAsJSON = JSON.stringify(sortKeys({ ...product, discount: product.discount ?? 0 }))
    console.log(updatedProductAsJSON, productAsJSON)
    if (updatedProductAsJSON === productAsJSON) {
      toast.warning('No se realizaron cambios en el producto.')
      setIsUpdatingProduct(false)
      return
    }

    updateProduct(updatedProduct)
      .then(({ error, data }) => {
        if (error) {
          throw new Error(error.message)
        }
        const [updatedProduct] = data
        onUpdateProduct(updatedProduct)
        toast.success('Producto actualizado exitosamente.')
      })
      .catch(() => {
        toast.error('Ocurrió un error al actualizar el producto, inténtelo más tarde.')
      })
      .finally(() => {
        setIsUpdatingProduct(false)
        close()
      })
  }

  return (
    <Modal
      size='5xl'
      show={opened}
      onClose={() => close()}
    >
      <Modal.Header>{product.name}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-4 gap-4'>
            <Label className='col-span-2'>
              <span>Nombre</span>
              <TextInput
                required
                defaultValue={product.name}
                className='mt-2'
                name='product-name'
                placeholder='Nombre del producto'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Marca</span>
              <TextInput
                defaultValue={product.brand}
                required
                className='mt-2'
                name='product-brand'
                placeholder='Marca del producto'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Categoría</span>
              <Select
                defaultValue={product.category_id}
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
                step={0.01}
                defaultValue={product.price}
                min={1}
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
                step={0.01}
                defaultValue={product.cost}
                min={1}
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
              defaultValue={product.stock}
              min={0}
              name='product-stock'
              type='number'
              className='mt-2 hidden'
              placeholder='1'
            />
            <Label className='col-span-1'>
              <span>Descuento</span>
              <TextInput
                defaultValue={product.discount}
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
                  defaultValue={product.supplier_id}
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
                defaultValue={product.description}
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
                  {isUpdatingProduct ? 'Actualizando' : 'Actualizar producto'}
                  {isUpdatingProduct && <Spinner />}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
