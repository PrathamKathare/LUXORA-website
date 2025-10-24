import { ShoppingCart, Search, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/authSlice'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const { isAuthenticated, userRole } = useSelector(state => state.auth)
  const cart = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="bg-black/95 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              LAUXORA
            </Link>
            {!isAuthenticated || userRole === 'customer' ? (
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/"
                  className="text-sm font-medium transition-colors hover:text-white"
                >
                  Home
                </Link>
                <Link 
                  to="/products"
                  className="text-sm font-medium transition-colors hover:text-white"
                >
                  Products
                </Link>
              </div>
            ) : null}
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {(!isAuthenticated || userRole === 'customer') && (
              <Link 
                to="/cart"
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 hidden md:block">
                  {userRole === 'admin' ? 'Admin Panel' : 'Welcome'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/login?role=admin"
                  className="bg-gray-700/50 text-gray-300 border border-gray-600/30 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}