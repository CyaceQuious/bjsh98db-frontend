// 网络请求处理器，为后续鉴权方便考虑
// 修改自小作业提供的 wrapper

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export enum NetworkErrorType {
    UNAUTHORIZED,
    REJECTED,
    CORRUPTED_RESPONSE,
    UNKNOWN_ERROR,
}

export class NetworkError extends Error {
    type: NetworkErrorType;
    message: string;

    constructor(
        _type: NetworkErrorType,
        _message: string,
    ) {
        super(_message);

        this.type = _type;
        this.message = _message;
    }

    toString(): string { return this.message; }
    valueOf(): string { return this.message; }
}

export const request = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: string, 
    needAuth?: boolean
) => {
    const headers = new Headers();
    if (needAuth === true) {
        const session = useSelector((state: RootState) => state.auth.session); 
        headers.append("Authorization", `${session}`);
    }
    if (body !== undefined) {
        headers.append("Content-Type", "application/x-www-form-urlencoded");
    }
    const response = await fetch(url, {
        method,
        body: body ? body : undefined,
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
    else if (response.status === 200) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[200] " + data.info,
        );
    }

    // HTTP status 401
    if (response.status === 401 && code === 2) {
        throw new NetworkError(
            NetworkErrorType.UNAUTHORIZED,
            "[401] " + data.info,
        );
    }
    else if (response.status === 401) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[401] " + data.info,
        );
    }

    // HTTP status 403
    if (response.status === 403 && code === 3) {
        throw new NetworkError(
            NetworkErrorType.REJECTED,
            "[403] " + data.info,
        );
    }
    else if (response.status === 403) {
        throw new NetworkError(
            NetworkErrorType.CORRUPTED_RESPONSE,
            "[403] " + data.info,
        );
    }

    throw new NetworkError(
        NetworkErrorType.UNKNOWN_ERROR,
        `[${response.status}] ` + data.info,
    );
};