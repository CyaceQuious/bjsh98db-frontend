import { SearchQuery, SearchResultItem } from "./types";
const searchQueryItemNameDictCn: Record<keyof SearchQuery, string> = {
    name: "姓名",
    groupname: "代表队", 
    meet: "运动会",
    projectname: "比赛项目",
    precise: "精确搜索", 
    ranked: "只显示前八名"
};
// current language is simplified chinese
export function getQueryItemName(itemName: keyof SearchQuery): string {
    return searchQueryItemNameDictCn[itemName]
}

const searchResultItemNameDictCn: Record<keyof SearchResultItem, string> = {
    name: "姓名",
    groupname: "代表队", 
    meet: "运动会",
    projectname: "比赛项目",
    result: "成绩", 
    grade: "运动成绩等级"
};
// current language is simplified chinese
export function getResultItemName(itemName: keyof SearchResultItem): string {
    return searchResultItemNameDictCn[itemName]
}

// current language is simplified chinese
export function getSearchBoxPlaceHolder(): string {
    return "请输入搜索内容，留空代表不指定"
}

// current language is simplified chinese
export function getSearchButtonText(): string {
    return "搜索"
}

const navBarItemDictCn: Record<"homepage" | "search", string> = {
    homepage: "主页", 
    search: "搜索"
};
// current language is simplified chinese
export function getNavBarItem(name: "homepage" | "search"): string {
    return navBarItemDictCn[name]
}