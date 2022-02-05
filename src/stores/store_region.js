import { createSlice } from '@reduxjs/toolkit'

export const regionSlice = createSlice({
  name: 'region',
  initialState: {
    provinces: [],
    cities: []
  },
  reducers: {
    initProvinces: (state, action) => {
      state.provinces = action.payload
    },
    initCities: (state, action) => {
      state.cities = action.payload
    },
    removeProvinces: (state) => {
      state.provinces = []
    },
    removeCities: (state) => {
      state.cities = []
    }
  }
})

export const { initProvinces, initCities, removeProvinces, removeCities } = regionSlice.actions

export default regionSlice.reducer
