import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用 localStorage

import exampleReducer from "./example";
import authReducer from "./auth";

// 合并所有 reducer
const rootReducer = combineReducers({
  example: exampleReducer,
  auth: authReducer
});

// 持久化配置
const persistConfig = {
  key: 'root',          // 存储的键名
  storage,              // 使用 localStorage
  whitelist: ['auth']   // 只持久化 auth 状态
};

// 创建持久化的 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // 忽略 redux-persist 的特殊 action
      },
    }),
});

// 创建 persistor
export const persistor = persistStore(store);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;