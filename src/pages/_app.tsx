import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store"; // 确保从 store 导出 persistor

import Navbar from "../components/NaviBar";

import UserRefresh from "../components/UserRefresh";

import '@ant-design/v5-patch-for-react-19';

// eslint-disable-next-line @typescript-eslint/naming-convention
const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title> BJSH98.db </title>
            </Head>
            <div>
                <UserRefresh/>
                <Navbar/>
                <Component {...pageProps} />
            </div>
        </>
    );
};

export default function AppWrapper(props: AppProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={undefined} persistor={persistor}>
                <App {...props} />
            </PersistGate>
        </Provider>
    );
}
