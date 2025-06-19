import axiosInstance from '../api/axiosInstance'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiRoutes from '../routes.js'

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ username, password }) => {
    const res = await axiosInstance.post(apiRoutes.login(), { username, password })
    return res.data
  },
)

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ username, password }) => {
    const res = await axiosInstance.post(apiRoutes.signup(), { username, password })
    return res.data
  },
)

const initialState = {
  error: '',
  isAuthenticated: Boolean(localStorage.getItem('token')),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      state.isAuthenticated = false
    },
    clearError: (state) => {
      state.error = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('username', action.payload.username)
        state.isAuthenticated = true
        state.error = ''
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('username', action.payload.username)
        state.isAuthenticated = true
        state.error = ''
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (action.error.code === 'ERR_BAD_REQUEST') {
          state.error = 'Invalid username or password'
        } else {
          state.error = 'Connection error'
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        if (action.error.code === 'ERR_BAD_REQUEST') {
          state.error = 'This user already exists'
        } else {
          state.error = 'Connection error'
        }
      })
  },
})

export const { actions } = userSlice
export default userSlice.reducer
