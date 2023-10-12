import { createSlice } from '@reduxjs/toolkit';
import { fetchedClusterData } from '../kafkaCluster/kafkaClusterSlice';

// Set initial state for Brokers
const initialState = {
    brokers: {
        byId: {},
        allIds: []
    },
    activeControllerCount: 0,
    partitionCount: 0,
    
    status: 'idle',
    error: null
};

// TODO: Add thunks to fetch extra broker metrics for broker popup modals

const brokerSlice = createSlice({
    name: 'broker',
    initialState,
    reducers: {
        resetBrokerData: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchedClusterData.fulfilled, (state, action) => {
            const incomingData = action.payload.brokerMetrics;
            state.brokers.allIds = Object.keys(incomingData);
            for (let brokerId in incomingData) {
                state.brokers.byId[brokerId] = {
                    id: brokerId,
                    ...incomingData[brokerId]
                };
            }

            state.status = 'success';
        
        }) 
    }
    
});


export const { resetBrokerData } = brokerSlice.actions;
export default brokerSlice.reducer;