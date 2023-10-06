import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialFetch } from './kafkaClusterService';

// creating initial state for all of kafkaCard's datapoints
// will have all the states here and have it refresh here so the ClusterComponents can pull that data

const initialState = {
    globalPartitionCount: '',
    // ActiveBrokers: '',
    underReplicatedPartitions: '',
    offlinePartitions: '',
    activeControllerCount: '',
    totalBytesIn: '',
    totalBytesOut: '',
    totalMessagesIn: '',
    // ErrorRate: '',
    partitionReplicaCount: '',
    partitionInSyncReplicaCount: '',
};

// let port;
// const portData = () => (dispatch, getState) => {
//     let port = store.getState().port;
//     console.log(port)
//     return port;
// }

// TODO : set the initialFetch 
export const fetchInitialData = createAsyncThunk(
    'kafkaCluster/fetchInitialData', 
    async(_, thunkAPI) => {
        const state = thunkAPI.getState();
        return await initialFetch(state);
    }
);

// we want to check to see if the 


const kafkaClusterSlice = createSlice({
    name: 'kafkaCluster',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInitialData.fulfilled, (state, action) => {
                state.globalPartitionCount = action.payload.kafka_controller_kafkacontroller_globalpartitioncount;
                // state.ActiveBrokers = action.payload.
                state.underReplicatedPartitions = action.payload.kafka_cluster_partition_underreplicated;
                state.offlinePartitions = action.payload.kafka_controller_kafkacontroller_offlinepartitionscount;
                state.activeControllerCount = action.payload.kafka_controller_kafkacontroller_activecontrollercount;
                state.totalBytesIn = action.payload.kafka_server_brokertopicmetrics_bytesin_total;
                state.totalBytesOut = action.payload.kafka_server_brokertopicmetrics_bytesout_total;
                state.totalMessagesIn = action.payload.kafka_server_brokertopicmetrics_messagesin_total;
                // state.ErrorRate = action.payload.
                state.partitionReplicaCount = action.payload.kafka_cluster_partition_replicascount;
                state.partitionInSyncReplicaCount = action.payload.kafka_cluster_partition_insyncreplicascount;

            })
    }
})

export default kafkaClusterSlice.reducer;