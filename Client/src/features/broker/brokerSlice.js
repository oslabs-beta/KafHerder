import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBrokerDataFromAPI } from './brokerService';
import { fetchedClusterData } from '../kafkaCluster/kafkaClusterSlice';



// set initial state for ClusterName
// will be fetching data from server with ClusterName and Port
// Initial State data points are TBD
const initialState = {
    brokers: {
        byId: {
            "kafka1:9992": {
                id: "kafka1:9992",
                kafka_server_brokertopicmetrics_bytesin_total: "540593",
                kafka_server_brokertopicmetrics_bytesout_total: "567481",
                kafka_server_kafkaserver_brokerstate: "3",
                kafka_server_replicamanager_offlinereplicacount: "0",
                kafka_server_replicamanager_partitioncount: "22",
                kafka_server_sessionexpirelistener_zookeeperdisconnects_total: "7"
              },
              "kafka2:9993": {
                id: "kafka2:9993",
                kafka_server_brokertopicmetrics_bytesin_total: "39517",
                kafka_server_brokertopicmetrics_bytesout_total: "26784",
                kafka_server_kafkaserver_brokerstate: "3",
                kafka_server_replicamanager_offlinereplicacount: "0",
                kafka_server_replicamanager_partitioncount: "24",
                kafka_server_sessionexpirelistener_zookeeperdisconnects_total: "7"
              },
              "kafka3:9994": {
                id: "kafka3:9994",
                kafka_server_brokertopicmetrics_bytesin_total: "6232",
                kafka_server_brokertopicmetrics_bytesout_total: "1109024",
                kafka_server_kafkaserver_brokerstate: "3",
                kafka_server_replicamanager_offlinereplicacount: "0",
                kafka_server_replicamanager_partitioncount: "23",
                kafka_server_sessionexpirelistener_zookeeperdisconnects_total: "7"
              },
        },
        allIds: ["kafka1:9992", "kafka2:9993", "kafka3:9994"]
    },
    activeControllerCount: 0,
    partitionCount: 0,
    
    status: 'idle',
    error: null
};

/** 
 * import fetchBrokerDataFromAPI here and set fetchBrokerdata as a variable export using createAsyncThunk.
 * Using this method can seem redundant or impractical but it sets brokerSlice as the single export file for all broker related items. As the app grows, it helps maintain clarity.
 * *The first parameter of createAsyncThunk is the name of the action.
 * *Standard convention is to name it '[slice name]/[action name]'.
 * *createAsyncThunk generates three Redux action creators: pending, fulfilled, and rejected.
 * *They are used in the extraReducers ['fetchBrokerdata.pending', 'fetchBrokerdata.fulfilled', 'fetchBrokerdata.rejected']
 * *RTK makes it so you can define reducers and actions in one place. You use .addCase instead of switch-case.
 * *You can have multiple reducers and have .addCase for them all if you have createAsyncThunks for them
*/

export const fetchBrokerData = createAsyncThunk(
    'broker/fetchBrokerData', fetchBrokerDataFromAPI
    );


/**
 * Todo: getBrokerMetrics sends back an object but does not have a name
 */
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
        .addCase(fetchBrokerData.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchBrokerData.fulfilled, (state, action) => {
            state.brokerIds = action.payload
            state.status = 'success';
        })
        .addCase(fetchBrokerData.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        //? Adding in an addCase here to check to see if fetchedClusterData is fulfilled. 
        .addCase(fetchedClusterData.fulfilled, (state, action) => {
            const incomingData = action.payload;
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