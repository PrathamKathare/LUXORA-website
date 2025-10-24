import { useSelector } from 'react-redux'
import ProductCard from '../Common/ProductCard'
import { Filter, Grid } from 'lucide-react'

export default function ProductsPage() {
  const products = useSelector(state => state.products.products)

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">All Products</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gray-900/50 border border-blue-500/20 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-900/50 border border-blue-500/20 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
              <Grid className="w-4 h-4" />
              <span>Sort</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}