import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClusterDataFromAPI } from './kafkaClusterService';

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

/**
 * accessing state to grab port information to use in param in initialFetch
 */
export const fetchedClusterData = createAsyncThunk(
    'kafkaCluster/fetchedClusterData', 
    async(_, thunkAPI) => {
        const state = thunkAPI.getState();
        return await fetchClusterDataFromAPI(state);
    }
);


const kafkaClusterSlice = createSlice({
    name: 'kafkaCluster',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchedClusterData.fulfilled, (state, action) => {
                // console.log('action payload', action.payload)
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