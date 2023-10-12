import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import clusterFormReducer from '../features/clusterform/clusterFormSlice'
import brokerReducer from '../features/broker/brokerSlice'
import kafkaClusterReducer from '../features/kafkaCluster/kafkaClusterSlice'
// import authReducer from '../features/auth/authSlice


export const store = configureStore({
    reducer: {
        clusterForm: clusterFormReducer,
        broker: brokerReducer,
        kafkaCluster: kafkaClusterReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})