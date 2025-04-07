import { useRouter } from 'next/router';

import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { resetData } from '../redux/auth';

import useRouteHistory from "../hook/useRouteHistroy";

export default function Logout() {
    const { canGoBack } = useRouteHistory();
    const router = useRouter();
    const dispatch = useDispatch();

    const {userName} = useSelector((state: RootState) => state.auth);

    if (!router.isReady) return (
        <div>Loading...</div>
    );

    if (userName === "") {
        alert("暂未登录。将返回首页。")
        router.push("/")
        return (<div>暂未登录。将返回首页。</div>)
    } 

    const decideLogout = () => {
        dispatch(resetData())
    }
    const quitLogout = () => {
        // 检查是否可以后退
        if (canGoBack) {
            router.back();
        } else {
            router.push("/");
        }
    }

    return (
        <div>
            <h1>已作为用户 {userName} 登录。确认退出登录？</h1>
            <button onClick={decideLogout}>确认</button>
            <button onClick={quitLogout}>取消</button>
        </div>
    )
}