import { request } from "../utils/network";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import store from "../redux/store";

import { checkUserName, checkPassword } from "../utils/auth";

import { FAILURE_PREFIX } from "../constants/string";

import { interfaceToString, RegisterRequest, RegisterResponse } from "../utils/types";

export default function RegisterForm() {
    const router = useRouter();
    // 如果已登录，强制跳转到登出界面
    useEffect(() => {
        if (store.getState().auth.userName !== "") {
            router.push("/logout"); 
        }
    }, [])
    const [userName, setUserNameNow] = useState(""); 
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState(""); 
    const [userNameInfo, setUserNameInfo] = useState(""); 
    const [passwordInfo, setPasswordInfo] = useState(""); 
    const [password2Info, setPassword2Info] = useState(""); 
    const clearInfo = () => {
        setUserNameInfo(""); 
        setPasswordInfo(""); 
        setPassword2Info(""); 
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
        if (newValue !== password2 && password2 !== "") {
            setPassword2Info("两次密码应当相同。"); 
        }
        setPassword(newValue); 
    }
    const changePassword2 = (newValue: string) => {
        clearInfo(); 
        if (checkPassword(newValue) === false) {
            if (password !== password2) {
                setPassword2Info("密码应当只包含字母、数字、下划线。两次密码应当相同。")
            } else {
                setPassword2Info("密码应当只包含字母、数字、下划线。"); 
            }
            return; 
        }
        if (newValue !== password && password2 !== "") {
            setPassword2Info("两次密码应当相同。"); 
        }
        setPassword2(newValue); 
    }
    const tryRegister = async () => {
        clearInfo(); 
        if (userName.length === 0) {
            setUserNameInfo("用户名不能为空。"); 
            return; 
        }
        if (password.length === 0) {
            setPasswordInfo("密码不能为空。"); 
            return; 
        }
        if (password2 !== password) {
            setPassword2Info("两次密码应当相同。"); 
            return; 
        }
        request(
            `/api/users/register`,
            'POST',
            interfaceToString({username: userName, password: password} as RegisterRequest),
            false
        ).then((res: RegisterResponse) => {
            alert(`${res.username} 注册成功！`); 
            router.push("/login"); 
        }).catch((err) => {
            alert(FAILURE_PREFIX + err);
        })

    }
    const jumpLogin = () => {
        router.push("/login")
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
            <input
                type="password"
                placeholder="密码"
                value={password2}
                onChange={(e) => changePassword2(e.target.value)}
            />
            <div>{password2Info}</div>
            <br/>
            <button onClick={tryRegister} disabled={userName === "" || password === ""}>
                注册
            </button>
            <div>
                已有帐号？直接前往 <div onClick={jumpLogin}>登录</div>
            </div> 
        </div>
    )
}