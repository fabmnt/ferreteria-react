import { Tabs } from 'flowbite-react'
import { MdOutlineInventory2 } from 'react-icons/md'
import { TbFileInvoice } from 'react-icons/tb'
import { ReporteVentas } from '../components/sales-for-customers'
import { ReporteInventario } from '../components/current-inventory'
import { VentasPorProducto } from '../components/sales-for-product'
import { FaListUl } from 'react-icons/fa'

export function GetReports() {
  return (
    <div className='w-full rounded border bg-white'>
      <Tabs
        aria-label='Full width tabs'
        variant='fullWidth'
      >
        <Tabs.Item
          active
          title='Ventas por Cliente'
          icon={TbFileInvoice}
        >
          <ReporteVentas />
        </Tabs.Item>
        <Tabs.Item
          active
          title='Ventas por producto'
          icon={MdOutlineInventory2}
        >
          <VentasPorProducto />
        </Tabs.Item>
        <Tabs.Item
          active
          title='Inventario de productos'
          icon={FaListUl}
        >
          <ReporteInventario />
        </Tabs.Item>
      </Tabs>
    </div>
  )
}
