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

export function searchQueryToString(params: SearchQuery): string {
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
}

export function getSearchResultDisplayOrder(): string[] {
    return ["name", "meet", "projectname", "groupname", "result", "grade"]
}

export interface SearchResult {
    code: number;
    info: string;
    count: number;
    results: SearchResultItem[]; 
}