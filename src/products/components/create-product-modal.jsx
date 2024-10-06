import { Button, Label, Modal, Select, Spinner, Textarea, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { createProduct } from '../../services/products'

export function CreateProductModal({ opened, close, categories }) {
  const [isCreatingNewPRoduct, setIsCreatingNewProduct] = useState(false)

  const handleSubmit = async (e) => {
    setIsCreatingNewProduct(true)
    e.preventDefault()
    const form = new FormData(e.target)
    const name = form.get('product-name')
    const brand = form.get('product-brand')
    const price = form.get('product-price')
    const stock = form.get('product-stock')
    const discount = form.get('product-discount')
    const category = form.get('product-category')
    const description = form.get('product-description')

    const newProduct = {
      name,
      brand,
      price,
      stock,
      discount,
      category_id: category,
      description,
    }

    await createProduct(newProduct)
    setIsCreatingNewProduct(false)
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
            <Label className='col-span-2'>
              <span>Marca</span>
              <TextInput
                required
                className='mt-2'
                name='product-brand'
                placeholder='Marca del producto'
              />
            </Label>
            <Label className='col-span-1'>
              <span>Precio</span>
              <TextInput
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
              <span>Existencias</span>
              <TextInput
                required
                min={0}
                name='product-stock'
                type='number'
                className='mt-2'
                placeholder='1'
              />
            </Label>
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
