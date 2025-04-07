import { request } from "../utils/network";
import { useState } from "react";
import { useRouter } from 'next/router';

import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setUserName, setSession, setCreateTime, setEmail, setRealName, setIsContestOfficial, setIsDepartmentOfficial, setIsSystemAdmin, setOrg } from "../redux/auth";

import useRouteHistory from "../hook/useRouteHistroy";

import { checkUserName, checkPassword } from "../utils/auth";
import { LoginRequest, LoginResponse } from "../utils/types";

import { FAILURE_PREFIX } from "../constants/string";

export default function LoginForm() {
    const { canGoBack } = useRouteHistory();
    const router = useRouter();
    const dispatch = useDispatch();
    // 如果已登录，强制跳转到登出界面
    if (useSelector((state: RootState) => state.auth.userName) !== "") {
        router.push("/logout"); 
    }
    const [userName, setUserNameNow] = useState(""); 
    const [password, setPassword] = useState("");
    const [userNameInfo, setUserNameInfo] = useState(""); 
    const [passwordInfo, setPasswordInfo] = useState(""); 
    const clearInfo = () => {
        setUserNameInfo(""); 
        setPasswordInfo(""); 
    }
    const changeUserName = (newValue: string) => {
        clearInfo(); 
        if (checkUserName(newValue) === false) {
            setUserNameInfo("用户名应当只包含字母、数字、下划线。"); 
            return; 
        }
        setUserNameNow(newValue); 
    }
    const changePassword = (newValue: string) => {
        clearInfo(); 
        if (checkPassword(newValue) === false) {
            setPasswordInfo("密码应当只包含字母、数字、下划线。"); 
            return; 
        }
        setPassword(newValue); 
    }
    const tryLogin = async () => {
        clearInfo(); 
        if (userName.length === 0) {
            setUserNameInfo("用户名不能为空。"); 
            return; 
        }
        if (password.length === 0) {
            setPasswordInfo("密码不能为空。"); 
            return; 
        }
        request(
            `/api/users/login`,
            'POST',
            {username: userName, password: password} as LoginRequest,
            false
        ).then((res: LoginResponse) => {
            dispatch(setUserName(res.username)); 
            dispatch(setSession(res.session));
            dispatch(setCreateTime(res.create_time));
            dispatch(setEmail(res.email));
            dispatch(setRealName(res.real_name));
            dispatch(setIsContestOfficial(res.Is_Contest_Official));
            dispatch(setIsDepartmentOfficial(res.Is_Department_Official));
            dispatch(setIsSystemAdmin(res.Is_System_Admin));
            dispatch(setOrg(res.org));

            alert(`登陆成功，用户名: ${res.username}`); 
            // 检查是否可以后退
            if (canGoBack) {
                router.back();
            } else {
                router.push("/");
            }
        }).catch((err) => {
            alert(FAILURE_PREFIX + err);
        })

    }
    const jumpRegister = () => {
        router.push("/register")
    }
    return (
        <div>
            <input
                type="text"
                placeholder="用户名"
                value={userName}
                onChange={(e) => changeUserName(e.target.value)}
            />
            <div>{userNameInfo}</div>
            <br/>
            <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => changePassword(e.target.value)}
            />
            <div>{passwordInfo}</div>
            <br/>
            <button onClick={tryLogin} disabled={userName === "" || password === ""}>
                登录
            </button>
            <button onClick={jumpRegister}>
                注册
            </button>
        </div>
    )
}