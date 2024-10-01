export function BillInformation({
  employeeFullName,
  billInformation: {
    totalBilled,
    totalIVA,
    totalDiscount,
    IVA,
    discount,
    totalToPay,
    paymentMethod,
  },
  updateBillInformation,
}) {
  const handleChangeDiscount = (e) => {
    updateBillInformation({ discount: e.target.value })
  }

  return (
    <>
      <div className='flex items-center justify-between gap-2'>
        <label
          htmlFor='payment-method'
          className='text-sm text-gray-900 dark:text-white'
        >
          Método de pago:
        </label>
        <div>
          <select
            id='payment-method'
            value={paymentMethod}
            className='w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            onChange={(e) => updateBillInformation({ paymentMethod: e.target.value })}
          >
            <option value='cash'>Efectivo</option>
            <option value='credit card'>Tarjeta de crédito</option>
            <option value='debit card'>Tarjeta de débito</option>
          </select>
        </div>
      </div>
      <p className='inline-flex justify-between text-sm'>
        Total facturado: <span className='font-normal'>{totalBilled}</span>
      </p>
      <p className='inline-flex justify-between text-sm'>
        Total IVA: <span className='font-normal'>{totalIVA}</span>
      </p>
      <p className='inline-flex justify-between text-sm'>
        Total descuento: <span className='font-normal'>{totalDiscount}</span>
      </p>
      <p className='inline-flex justify-between text-sm'>
        Total a pagar: <span className='font-normal'>{totalToPay}</span>
      </p>
      <div className='flex items-center justify-between gap-x-4'>
        <label className='col-start-2 flex items-center gap-2 text-sm'>
          Descuento:
          <div>
            <input
              onChange={handleChangeDiscount}
              max={100}
              min={0}
              value={discount}
              type='number'
              className='mr-2 h-8 max-w-14 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-900'
            />
            <span>%</span>
          </div>
        </label>
        <label className='flex items-center justify-end gap-2 text-sm'>
          IVA:
          <div>
            <input
              onChange={(e) => updateBillInformation({ IVA: e.target.value })}
              min={0}
              max={100}
              value={IVA}
              type='number'
              className='mr-2 h-8 max-w-14 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-900'
            />
            <span>%</span>
          </div>
        </label>
      </div>

      <p className='mt-auto text-sm font-semibold text-gray-800'>
        Esta factura está siendo registrada por:{' '}
        <span className='font-normal'>{employeeFullName}</span>
      </p>
    </>
  )
}
