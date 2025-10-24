import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [
    // Example order structure
    // {
    //   id: 1,
    //   items: [{ id: 1, name: 'Product A', quantity: 2 }],
    //   total: 100,
    //   status: 'pending',
    //   userId: 1,
    //   createdAt: '2023-10-01T12:00:00Z'
    // }
  ]
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload)
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload
      const order = state.orders.find(o => o.id === id)
      if (order) {
        order.status = status
      }
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(o => o.id !== action.payload)
    }
  }
})

export const { addOrder, updateOrderStatus, deleteOrder } = orderSlice.actions
export default orderSlice.reducer