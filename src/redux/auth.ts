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
    isSystemAdmin: false
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
        resetData: (state) => {
            state.userName = "";
            state.session = ""; 
        },
    },
});

export const { setUserName, setSession, setCreateTime, setEmail, setRealName, setIsContestOfficial, setIsDepartmentOfficial, setIsSystemAdmin, setOrg, resetData } = authSlice.actions;
export default authSlice.reducer;
