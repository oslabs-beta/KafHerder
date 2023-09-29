import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkPortFromAPI } from './clusterFormService';
import { fetchInitialData } from '../kafkaCluster/kafkaClusterSlice';
import { useDispatch } from 'react-redux';
// set initial state for ClusterName
// will be fetching data from server with ClusterName and Port
const initialState = {
    ClusterName: '',
    Port: '',
    Interval: 5,
    Status: 'off',
    Error: null
}

// probably want to create a createAsyncThunk that checks to see if the port connection went through
// if connection went through, we change the status to 'On'
// else we give an error that says that port could not be connected

export const checkPort = createAsyncThunk(
    'clusterForm/checkPort', checkPortFromAPI
);

const dispatch = useDispatch;

// created state that shows if the port connected to the server
const clusterFormSlice = createSlice({
    name: 'clusterForm',
    initialState,
    reducers: {
        setClusterForm: (state, action) => {
            state.ClusterName = action.payload.ClusterName;
            state.Port = action.payload.Port;
            state.Interval = action.payload.Interval;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkPort.pending, (state) => {
            state.Status = 'pending';
        })
        .addCase(checkPort.fulfilled, (state, action) => { // thunkAPI
            state.Status = 'on';
            // thunkAPI.dispatch(fetchInitialData());
        })
        .addCase(checkPort.rejected, (state, action) => {
            state.Status = 'off';
            state.Error = action.error.message
        })
    }
    
});


export const { setClusterForm } = clusterFormSlice.actions;
export default clusterFormSlice.reducer;