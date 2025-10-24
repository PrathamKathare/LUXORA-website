import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Check, CreditCard, MapPin, Phone, Mail } from 'lucide-react'
import { clearCart } from '../../features/cartSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'

export default function CheckoutPage() {
  const cart = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handlePlaceOrder = () => {
    dispatch(clearCart())
    toast.success('Order placed successfully!')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment" className="text-blue-600" defaultChecked />
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Credit Card</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6 h-fit">
            <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-white font-semibold text-lg mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Place Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}