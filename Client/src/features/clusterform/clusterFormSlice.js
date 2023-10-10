import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkPromPortFromAPI, checkKafkaPortFromAPI, fetchPartitionDataFromAPI, fetchRepartitionDataToAPI } from './clusterFormService';
import { fetchedClusterData } from '../kafkaCluster/kafkaClusterSlice';

const initialState = {
    clusterName: '',
    promPort: '',
    kafkaPort: '',
    topics: [],
    selectedTopic: 'Animals2',
    partitionData: ['partition1', 'partition2', 'partition3', 'partition3', 'partition3', 'partition3', 'partition3', 'partition3'],
    offsetJSON: {},
    mimNumOfPartitions: '4',
    newTopic: '',
    newMinPartitionNum: '',
    newReplicationFactor: '',
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

export const checkPartitionData = createAsyncThunk(
    'clusterForm/checkPartitionData',
        async(_, thunkAPI) => {
            const state = thunkAPI.getState();
            return await fetchPartitionDataFromAPI(state);
})

export const checkRepartitionData = createAsyncThunk(
    'clusterForm/checkRepartitionData',
        async(_, thunkAPI) => {
            const state = thunkAPI.getState();
            return await fetchRepartitionDataToAPI(state);
})

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
        },
        setSelectedTopic: (state, action) => {
            state.selectedTopic = action.payload;
            console.log('selected topic in slice', state.selectedTopic)
        },
        setRepartitionData: (state, action) => {
            state.newTopic = action.payload.newTopic;
            state.newMinPartitionNum = action.payload.newMinPartitionNum;
            state.newReplicationFactor = action.payload.newReplicationFactor;
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
            })
            .addCase(checkKafkaPort.fulfilled, (state, action) => {
                state.topics = action.payload.topics;
            })
            .addCase(checkKafkaPort.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(checkPartitionData.fulfilled, (state, action) => {
                // is this returned data key partitionData? or should we be calling it just the action.payload
                // depends on how the data returned from calling checkPartitionData is returned. 
                // adminController.js returns res.locals.partitions
                // I dont think that there is a key called partitionData. Lets check on that
                // we are also going to get data regarding partition min number and offset data json
                state.partitionData = action.payload.partitions
                state.mimNumOfPartitions = action.payload.minNumOfPartitions // change name of variable
                state.offsetData = action.payload.offsetData // change name of variable
            }) // TODO: add cases for pending for checkRepartionData
    }
});


export const { setClusterForm, setKafkaPort, setSelectedTopic, setRepartitionData } = clusterFormSlice.actions;
export default clusterFormSlice.reducer;