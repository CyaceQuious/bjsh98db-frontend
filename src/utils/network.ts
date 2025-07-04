// 网络请求处理器，为后续鉴权方便考虑
// 修改自小作业提供的 wrapper

import { interfaceToString } from "./types";

import store from "../redux/store";

export class NetworkError extends Error {
    status: number;
    code: number;
    message: string;

    constructor(
        _status: number,
        _code: number,
        _message: string,
    ) {
        super(_message);

        this.status = _status;
        this.code = _code;
        this.message = _message;
    }

    toString(): string { return this.message; }
    valueOf(): string { return this.message; }
}

// 因为后端的实现有点奇怪，所以我们这里默认使用表单方式来发送请求体的内容
export const request = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: object | string, 
    needAuth?: boolean, 
    bodyType?: "json" | "form"
) => {
    console.log(`[request] ${method} ${url}`);
    const headers = new Headers();
    if (needAuth === true) {
        const session = store.getState().auth.session; 
        headers.append("Authorization", `${session}`);
    }
    let body_str: undefined | string;
    if (body !== undefined) {
        if (bodyType === "json") {
            headers.append("Content-Type", "application/json");
            if (typeof body === "object") {
                body_str = JSON.stringify(body);
            } else {
                body_str = body;
            }
        } else {
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            if (typeof body === "object") {
                body_str = interfaceToString(body);
            } else {
                body_str = body;
            }
        }
    }
    const response = await fetch(url, {
        method,
        body: body_str, 
        headers
    });

    // // BEGIN: fake response for test
    // // reserved temporarily for future test use
    // const datatest = {
    //     code: 0, 
    //     info: "Succeed", 
    //     count: 2, 
    //     results: [
    //         {
    //             name: "戎胤泽",
    //             meet: "2024清华大学第六十七届马拉松杯学生田径运动会",
    //             projectname: "男子甲组800米决赛",
    //             groupname: "致理",
    //             result: "02:20.71",
    //             grade: ""
    //         },
    //         {
    //             name: "戎胤泽2",
    //             meet: "2024清华大学第六十七届马拉松杯学生田径运动会",
    //             projectname: "男子甲组800米决赛",
    //             groupname: "致理",
    //             result: "02:20.71",
    //             grade: ""
    //         }
    //     ]
    // }
    // return { ...datatest};
    // // END: fake response for test
    const data = await response.json();
    const code = Number(data.code);
    console.log(`${data}, ${code}`);
    console.log(data)
    // HTTP status 200
    if (response.status === 200 && code === 0) {
        return { ...data, code: 0};
    }
    throw new NetworkError(
        response.status,
        code,
        `[${response.status}](${code}) ` + data.info,
    );
};

export async function getContestName(mid: number) {
    try {
        const data = await request(`/api/query_meet_name?mid=${mid}`, "GET", undefined, false, undefined);
        console.log(data.name);
        return data.name;
    } catch {
        console.log("meet query error");
        return "meet_query_error";
    }
}