export function CardContainer({ children }) {
  return (
    <section className='mx-auto w-[520px] rounded-lg border bg-white px-8 py-10 shadow-xl transition-all dark:border-gray-700 dark:bg-[#191c25] dark:text-gray-200 dark:shadow-lg'>
      {children}
    </section>
  )
}
