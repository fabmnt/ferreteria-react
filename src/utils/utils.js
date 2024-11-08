export const sortKeys = (obj) => {
  return Object.keys(obj)
    .sort() // Ordenar las claves alfabéticamente
    .reduce((acc, key) => {
      acc[key] = obj[key] // Construir el nuevo objeto con las claves ordenadas
      return acc
    }, {})
}

export function downloadJSON(content, filename) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
