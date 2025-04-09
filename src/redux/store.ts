import { configureStore } from "@reduxjs/toolkit";

import exampleReducer from "./example";
import authReducer from "./auth"

const store = configureStore({
    reducer: {
        example: exampleReducer,
        auth: authReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
