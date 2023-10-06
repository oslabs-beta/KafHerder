import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkPortFromAPI } from './clusterFormService';
import { fetchedClusterData } from '../kafkaCluster/kafkaClusterSlice';

const initialState = {
    clusterName: '',
    port: '',
    interval: 5,
    status: 'off',
    error: null
}

// used createAsyncThunk to check if the port connection went through
// if connection went through, we change the status to 'On'
// else we give an error that says that port could not be connected

export const checkPort = createAsyncThunk(
    'clusterForm/checkPort', checkPortFromAPI
);

// created state that shows if the port connected to the server
const clusterFormSlice = createSlice({
    name: 'clusterForm',
    initialState,
    reducers: {
        setClusterForm: (state, action) => {
            state.clusterName = action.payload.clusterName;
            state.port = action.payload.port;
            state.interval = action.payload.interval;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkPort.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(checkPort.fulfilled, (state, action) => {
            state.status = 'on';
            fetchedClusterData()
        })
        .addCase(checkPort.rejected, (state, action) => {
            state.status = 'off';
            state.error = action.error.message
        })
    }
    
});


export const { setClusterForm } = clusterFormSlice.actions;
export default clusterFormSlice.reducer;