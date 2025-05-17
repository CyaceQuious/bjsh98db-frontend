import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthData {
    userName: string; // 空串意味着未登录
    session: string;  
    email: string; 
    createTime: string; 
    realName: string; 
    org: string;
    isDepartmentOfficial: boolean; 
    isContestOfficial: number[];
    isSystemAdmin: boolean; 
    hasUnreadAuth: boolean; // 新增：是否有未读认证申请
}

const initialState: AuthData = {
    userName: "",  
    session: "", 
    email: "",
    createTime: "",
    realName: "",
    org: "",
    isDepartmentOfficial: false,
    isContestOfficial: [],
    isSystemAdmin: false,
    hasUnreadAuth: false // 初始化为false
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload; 
        },
        setSession: (state, action: PayloadAction<string>) => {
            state.session = action.payload; 
        }, 
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload; 
        }, 
        setCreateTime: (state, action: PayloadAction<string>) => {
            state.createTime = action.payload;
        }, 
        setRealName: (state, action: PayloadAction<string>) => {
            state.realName = action.payload;
        }, 
        setOrg: (state, action: PayloadAction<string>) => {
            state.org = action.payload;
        }, 
        setIsDepartmentOfficial: (state, action: PayloadAction<boolean>) => {
            state.isDepartmentOfficial = action.payload;
        }, 
        setIsContestOfficial: (state, action: PayloadAction<number[]>) => {
            state.isContestOfficial = action.payload;
        }, 
        setIsSystemAdmin: (state, action: PayloadAction<boolean>) => {
            state.isSystemAdmin = action.payload;
        },
        // 新增：设置未读认证申请状态
        setHasUnreadAuth: (state, action: PayloadAction<boolean>) => {
            state.hasUnreadAuth = action.payload;
        },
        resetData: (state) => {
            state.userName = "";
            state.session = ""; 
            state.email = "";
            state.createTime = "";
            state.realName = "";
            state.org = "";
            state.isDepartmentOfficial = false;
            state.isContestOfficial = [];
            state.isSystemAdmin = false;
            state.hasUnreadAuth = false; // 重置时也重置未读状态
        },
    },
});

// 导出新增的action
export const { 
    setUserName, 
    setSession, 
    setCreateTime, 
    setEmail, 
    setRealName, 
    setIsContestOfficial, 
    setIsDepartmentOfficial, 
    setIsSystemAdmin, 
    setOrg, 
    setHasUnreadAuth, // 新增
    resetData 
} = authSlice.actions;

export default authSlice.reducer;