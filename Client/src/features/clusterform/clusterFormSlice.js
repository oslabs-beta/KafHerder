import { createSlice } from '@reduxjs/toolkit'


// set initial state for ClusterName
// will be fetching data from server with ClusterName and Port
const initialState = {
    ClusterName: '',
    Port: '',
}



const clusterFormSlice = createSlice({
    name: 'clusterForm',
    initialState,
    reducers: {
        setClusterForm: (state, action) => {
            state.ClusterName = action.payload.ClusterName;
            state.Port = action.payload.Port;
        }
    }
    
});


export const { setClusterForm } = clusterFormSlice.actions;
export default clusterFormSlice.reducer;