import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialFetch } from './kafkaClusterService';

// creating initial state for all of kafkaCard's datapoints
// will have all the states here and have it refresh here so the ClusterComponents can pull that data

const initialState = {
    GlobalPartitionCount: '',
    // ActiveBrokers: '',
    UnderReplicatedPartitions: '',
    OfflinePartitions: '',
    ActiveControllerCount: '',
    TotalBytesIn: '',
    TotalBytesOut: '',
    TotalMessagesIn: '',
    // ErrorRate: '',
    PartitionReplicaCount: '',
    PartitionInSyncReplicaCount: '',
};

export const fetchInitialData = createAsyncThunk(
    'kafkaCluster/fetchInitialData', initialFetch
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
                state.GlobalPartitionCount = action.payload.kafka_controller_kafkacontroller_globalpartitioncount;
                // state.ActiveBrokers = action.payload.
                state.UnderReplicatedPartitions = action.payload.kafka_cluster_partition_underreplicated;
                state.OfflinePartitions = action.payload.kafka_controller_kafkacontroller_offlinepartitionscount;
                state.ActiveControllerCount = action.payload.kafka_controller_kafkacontroller_activecontrollercount;
                state.TotalBytesIn = action.payload.kafka_server_brokertopicmetrics_bytesin_total;
                state.TotalBytesOut = action.payload.kafka_server_brokertopicmetrics_bytesout_total;
                state.TotalMessagesIn = action.payload.kafka_server_brokertopicmetrics_messagesin_total;
                // state.ErrorRate = action.payload.
                state.PartitionReplicaCount = action.payload.kafka_cluster_partition_replicascount;
                state.PartitionInSyncReplicaCount = action.payload.kafka_cluster_partition_insyncreplicascount;

            })
    }
})

export default kafkaClusterSlice.reducer;