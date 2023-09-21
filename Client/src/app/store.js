import { configureStore } from '@reduxjs/toolkit'
import clusterFormReducer from '../features/clusterform/clusterFormSlice'
// import authReducer from '../features/auth/authSlice


export const store = configureStore({
    reducer: {
        clusterForm: clusterFormReducer,
    }
})