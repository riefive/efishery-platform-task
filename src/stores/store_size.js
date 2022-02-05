import { createSlice } from '@reduxjs/toolkit'

export const sizeSlice = createSlice({
  name: 'size',
  initialState: { values: [] },
  reducers: {
    initSizes: (state, action) => {
      state.values = action.payload
    },
    removeSizes: (state) => {
      state.values = []
    }
  }
})

export const { initSizes, removeSizes } = sizeSlice.actions

export default sizeSlice.reducer
