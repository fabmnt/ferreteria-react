import { Tabs } from 'flowbite-react'
import { MdOutlineInventory2 } from 'react-icons/md'
import { TbFileInvoice } from 'react-icons/tb'
import { ReporteVentas } from '../components/sales-for-customers'
import { ReporteInventario } from '../components/current-inventory'

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
          title='Inventario de productos'
          icon={MdOutlineInventory2}
        >
          <ReporteInventario />
        </Tabs.Item>
      </Tabs>
    </div>
  )
}
