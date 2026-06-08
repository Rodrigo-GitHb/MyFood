import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dish, CartItem } from '../../types'

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  isOpen: false
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Dish>) => {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.quantity++
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    remove: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(0, item.quantity + action.payload.amount)
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id)
        }
      }
    },
    open: (state) => {
      state.isOpen = true
    },
    close: (state) => {
      state.isOpen = false
    },
    clear: (state) => {
      state.items = []
    }
  }
})

export const { add, remove, updateQuantity, open, close, clear } = cartSlice.actions
export default cartSlice.reducer
