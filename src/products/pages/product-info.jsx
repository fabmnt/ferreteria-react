import { useParams } from 'wouter'

export function ProductInfo() {
  const { id } = useParams()
  // const [product, setProduct] = useState(null)

  return <h3>{id}</h3>
}
