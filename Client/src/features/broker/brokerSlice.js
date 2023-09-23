import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchBrokerDataFromAPI } from './brokerService'

// set initial state for ClusterName
// will be fetching data from server with ClusterName and Port
// Initial State data points are TBD
const initialState = {
    BrokerId: null,
    ActiveControllerCount: 0,
    PartitionCount: 0,
    // OfflinePartitionsCount: '',
    // UncleanLeaderElectionsPerSec: '',
    // BytesInPerSec: '',
    // BytesOutPerSec: '',
    // RequestsPerSec: '',
    status: 'idle',
    error: null
}

/** 
 * import fetchBrokerDataFromAPI here and set fetchBrokerdata as a variable export using createAsyncThunk.
 * Using this method can seem redundant or impractical but it sets brokerSlice as the single export file for all broker related items. As the app grows, it helps maintain clarity.
 * !The first parameter of createAsyncThunk is the name of the action.
 * !Standard convention is to name it '[slice name]/[action name]'.
 * !createAsyncThunk generates three Redux action creators: pending, fulfilled, and rejected.
 * !They are used in the extraReducers ['fetchBrokerdata.pending', 'fetchBrokerdata.fulfilled', 'fetchBrokerdata.rejected']
 * !RTK makes it so you can define reducers and actions in one place. You use .addCase instead of switch-case.
*/

export const fetchBrokerData = createAsyncThunk(
    'broker/fetchData', fetchBrokerDataFromAPI
    );


// commented out the other state keys because it was too much to type. 
// we still dont know what data we are fetching
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
            const { BrokerId,
                 ActiveControllerCount, 
                 PartitionCount, 
                //  OfflinePartitionsCount, 
                //  UncleanLeaderElectionsPerSec, 
                //  BytesInPerSec, 
                //  BytesOutPerSec, 
                //  RequestsPerSec 
                } = action.payload;

            state.BrokerId = BrokerId;
            state.ActiveControllerCount = ActiveControllerCount;
            state.PartitionCount = PartitionCount;
            // state.OfflinePartitionsCount = OfflinePartitionsCount;
            // state.UncleanLeaderElectionsPerSec = UncleanLeaderElectionsPerSec;
            // state.BytesInPerSec = BytesInPerSec;
            // state.BytesOutPerSec = BytesOutPerSec;
            // state.RequestsPerSec = RequestsPerSec;
            state.status = 'success';
        })
        .addCase(fetchBrokerData.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
    
});


export const { setClusterForm } = brokerSlice.actions;
export default brokerSlice.reducer;