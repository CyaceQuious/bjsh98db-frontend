import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import store from "../redux/store";
import { Provider } from "react-redux";

import Navbar from "../components/NaviBar";

// eslint-disable-next-line @typescript-eslint/naming-convention
const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title> BJSH98.db </title>
            </Head>
            <div style={{ padding: 12 }}>
                <Navbar/>
                <Component {...pageProps} />
            </div>
        </>
    );
};

export default function AppWrapper(props: AppProps) {
    return (
        <Provider store={store}>
            <App {...props} />
        </Provider>
    );
}
