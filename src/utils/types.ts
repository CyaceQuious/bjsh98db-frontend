export interface SearchQuery {
    name?: string; 
    meet?: string; 
    projectname?: string; 
    groupname?: string; 
    ranked?: boolean; 
    precise?: boolean; 
}

export function getEmptyQuery():SearchQuery {
    return {
        name: "", 
        meet: "", 
        projectname: "", 
        groupname: "", 
        ranked: false, 
        precise: false, 
    }
}

export function interfaceToString(params: object): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && typeof value === "string") {
            searchParams.append(key, value.toString());
        }
        if (value === true) {
            searchParams.append(key, value)
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
    groupname: string; 
    result: string; 
    grade: string; 
    rank: string; 
}

export function getSearchResultDisplayOrder(): string[] {
    return ["name", "meet", "projectname", "groupname", "result", "grade", "rank"]
}

export interface SearchResult {
    code: number;
    info: string;
    count: number;
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
    Is_Contest_Official: boolean; 
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
