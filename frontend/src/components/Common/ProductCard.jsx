import { ShoppingCart, Heart, Star, Edit, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../features/cartSlice'
import { deleteProduct } from '../../features/productSlice'
import { toast } from 'react-hot-toast'

export default function ProductCard({ product, isAdmin = false, onEdit }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCart(product))
    toast.success('Added to cart!')
  }

  const handleDelete = () => {
    dispatch(deleteProduct(product.id))
    toast.success('Product deleted')
  }

  return (
    <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group hover:transform hover:scale-[1.02]">
      <div className="relative overflow-hidden">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <button className="p-1.5 bg-black/60 rounded-full text-gray-300 hover:text-red-400 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        {product.stock < 10 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white text-sm truncate">{product.name}</h3>
          <span className="text-blue-400 font-bold text-lg">${product.price}</span>
        </div>
        
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          <span className="text-xs text-gray-500">{product.stock} in stock</span>
        </div>

        {isAdmin ? (
          <div className="flex space-x-2">
            <button 
              onClick={onEdit}
              className="flex-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 py-2 px-3 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600/20 text-red-400 border border-red-500/30 py-2 px-3 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  )
}