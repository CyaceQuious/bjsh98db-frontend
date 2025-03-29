import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExampleData {
    dataName: string;
}

const initialState: ExampleData = {
    dataName: "",
};

export const exampleSlice = createSlice({
    name: "example",
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<string>) => {
            state.dataName = action.payload; 
        },
        resetData: (state) => {
            state.dataName = "";
        },
    },
});

export const { setData, resetData } = exampleSlice.actions;
export default exampleSlice.reducer;
