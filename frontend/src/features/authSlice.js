import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  userRole: null,
  user: null,
  loading: false,
  error: null
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ role }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const mockUsers = {
        admin: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
        customer: { id: 2, name: 'Customer', email: 'customer@example.com', role: 'customer' }
      }
      
      const user = mockUsers[role]
      if (!user) throw new Error('Invalid credentials')
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.userRole = null
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.userRole = action.payload.role
        state.user = action.payload
        state.loading = false
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer