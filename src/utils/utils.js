export const sortKeys = (obj) => {
  return Object.keys(obj)
    .sort() // Ordenar las claves alfabéticamente
    .reduce((acc, key) => {
      acc[key] = obj[key] // Construir el nuevo objeto con las claves ordenadas
      return acc
    }, {})
}
