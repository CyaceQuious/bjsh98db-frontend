// 登出页面
// 不过目前正常使用应该不会到这个页面来

import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

    useEffect(() => {
        if (userName === "") {
            alert("暂未登录所以无法登出。将返回首页。")
            router.push("/")
        }
    }, [])

    const decideLogout = () => {
        const oldUserName = userName; 
        dispatch(resetData()); 
        alert(`用户 ${oldUserName} 已登出。`)
        if (canGoBack) {
            router.back();
        } else {
            router.push("/");
        }
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