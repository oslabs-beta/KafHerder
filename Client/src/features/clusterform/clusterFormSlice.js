import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkPromPortFromAPI, checkKafkaPortFromAPI } from './clusterFormService';
import { fetchedClusterData } from '../kafkaCluster/kafkaClusterSlice';

const initialState = {
    clusterName: '',
    promPort: '',
    kafkaPort: '',
    interval: 5,
    status: 'off',
    error: null
}

// used createAsyncThunk to check if the port connection went through
// if connection went through, we change the status to 'On'
// else we give an error that says that port could not be connected

export const checkPromPort = createAsyncThunk(
    'clusterForm/checkPromPort', checkPromPortFromAPI
);

export const checkKafkaPort = createAsyncThunk(
    'clusterForm/checkKafkaPort', checkKafkaPortFromAPI
)

// created state that shows if the port connected to the server
const clusterFormSlice = createSlice({
    name: 'clusterForm',
    initialState,
    reducers: {
        setClusterForm: (state, action) => {
            state.clusterName = action.payload.clusterName;
            state.promPort = action.payload.promPort;
            state.interval = action.payload.interval;
        },
        setKafkaPort: (state, action) => {
            state.kafkaPort = action.payload.kafkaPort;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkPromPort.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(checkPromPort.fulfilled, (state, action) => {
            state.status = 'on';
            fetchedClusterData()
        })
        .addCase(checkPromPort.rejected, (state, action) => {
            state.status = 'off';
            state.error = action.error.message
        }) // TODO: add extraReducers for checkKafkaPort. On fulfilled we'll fetch the data.
    }
    
});


export const { setClusterForm, setKafkaPort } = clusterFormSlice.actions;
export default clusterFormSlice.reducer;