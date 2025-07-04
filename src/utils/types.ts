export interface SearchQuery {
    name?: string; 
    meet?: string; 
    projectname?: string; 
    leixing?: string; 
    xingbie?: string; 
    zubie?: string; 
    groupname?: string; 
    ranked?: boolean; 
    precise?: boolean;
    page: number;
    page_size: number;
    star?: boolean; 
    session?: string; 
}

export function getEmptyQuery():SearchQuery {
    return {
        name: "", 
        meet: "", 
        projectname: "", 
        leixing: "", 
        xingbie: "",
        zubie: "",
        groupname: "", 
        ranked: false, 
        precise: false, 
        page: 1, 
        page_size: 10, 
        star: false,
        session: "",
    }
}

export function interfaceToString(params: object, skipKeys: string[] = []): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (key in skipKeys) {
            return; 
        }
        if (value !== undefined && value !== "" && typeof value === "string") {
            value.split(/[\s,，;；]+/).filter(Boolean).forEach(item => {
                searchParams.append(key, item); 
            });
        }
        if (value === true) {
            searchParams.append(key, value); 
        }
        if (value !== undefined && typeof value === "number") {
            searchParams.append(key, value.toString()); 
        }
    });

    return searchParams.toString();
}

// Example: 
// "name": "戎胤泽",
// "meet": "2024清华大学第六十七届马拉松杯学生田径运动会",
// "projectname": "男子甲组800米决赛",
// "groupname": "致理",
// "result": "02:20.71",
// "grade": ""
// 
// 用于前后端交互，传递搜索结果
export interface SearchResultItem {
    name: string; 
    meet: string; 
    projectname: string; 
    xingbie: string; 
    zubie: string;
    leixing: string;
    groupname: string; 
    result: string; 
    grade: string; 
    rank: string; 
    score: string; 
    mid: number;
    resultid: number;
    projectid: number;
}

export interface SearchResult {
    code: number;
    info: string;
    count: number;
    total_pages: number;
    current_page: number;
    results: SearchResultItem[]; 
}

export interface LoginRequest {
    username: string; 
    password: string; 
}

export interface LoginResponse {
    session: string; 
    username: string;
    email: string; 
    create_time: string; 
    real_name: string; 
    org: string;
    Is_Department_Official: boolean; 
    Is_Contest_Official: number[]; 
    Is_System_Admin: boolean; 
}

export interface RegisterRequest {
    username: string; 
    password: string; 
}

export interface RegisterResponse {
    username: string;
}

export interface Meet {
    name: string;
    mid: number;
}
  
export interface MeetsApiResponse {
    code: number;
    info: string;
    count: number;
    results: Meet[];
}

export interface TeamScoreResponse {
    code: number;
    info: string;
    results: TeamScore[];
  }
  
  export interface TeamScore {
    team: string;
    total_score: number;
  }
  
  export interface TeamScoreRequest {
    mid: number;
  }

  export interface UserProfile {
  username: string;
  email: string;
  create_time: string;
  Is_Department_Official: boolean;
  Is_Contest_Official: string[];
  Is_System_Admin: boolean;
  star_list: string[];
}

export interface AuthRequest {
  message_id: number;
  real_name: string;
  invited_reviewer: string;
  applied_at: string;
  status: number; // 0: pending, 1: approved, 2: rejected
  reject_reason?: string;
  replied_at?: string;
  sender_username?: string;
}

/**
 * 过滤对象属性，仅保留类型 T 中定义的键
 * @param obj 原始对象
 * @param keys 类型 T 的键列表
 * @returns 符合类型 T 的对象
 */
export function filterByType<T>(obj: any, keys: (keyof T)[]): T {
    const result = {} as T;
    keys.forEach((key) => {
        result[key] = obj[key] || undefined;
    });
    return result;
}