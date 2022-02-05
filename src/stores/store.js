import { configureStore } from '@reduxjs/toolkit'
import regionReducer from './store_region'
import sizeReducer from './store_size'

export default configureStore({
  reducer: {
    regions: regionReducer,
    sizes: sizeReducer
  }
})
