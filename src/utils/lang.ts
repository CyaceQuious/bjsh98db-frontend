import { SearchQuery } from "./types";
import { SearchResultTableItem } from "../components/SearchResultTable";
const searchQueryItemNameDictCn: Record<keyof SearchQuery, string> = {
    name: "姓名",
    groupname: "代表队",
    meet: "运动会",
    projectname: "比赛项目",
    xingbie: "性别", 
    zubie: "组别", 
    leixing: "类型", 
    precise: "精确搜索",
    ranked: "只显示前八名", 
    page: "", 
    page_size: "", 
    star: "只显示我的关注",
    session: "",
};
// current language is simplified chinese
export function getQueryItemName(itemName: keyof SearchQuery): string {
    return searchQueryItemNameDictCn[itemName]
}

const searchResultTableItemNameDictCn: Record<keyof SearchResultTableItem, string> = {
    name: "姓名",
    groupname: "代表队",
    meet: "运动会",
    projectname: "比赛项目",
    xingbie: "性别",
    zubie: "组别",
    leixing: "项目阶段",
    result: "成绩",
    grade: "运动技术等级",
    rank: "名次", 
    score: "得分", 
    manage: "管理",
    mid: "运动会编号",
};
// current language is simplified chinese
export function getResultTableItemName(itemName: keyof SearchResultTableItem): string {
    return searchResultTableItemNameDictCn[itemName]
}

const searchQueryPlaceHolderDictCn: Record<keyof SearchQuery, string> = {
    name: "留空代表不指定。例：张三",
    groupname: "留空代表不指定。例：清华",
    meet: "留空代表不指定。例：	2024,马约翰杯",
    projectname: "留空代表不指定。例：跳高",
    xingbie: "留空代表不指定。例：男子",
    zubie: "留空代表不指定。例：甲组",
    leixing: "留空代表不指定。例：决赛",
    precise: "",
    ranked: "", 
    page: "", 
    page_size: "", 
    star: "",
    session: "",
};
// current language is simplified chinese
export function getSearchBoxPlaceHolder(name: string): string {
    return searchQueryPlaceHolderDictCn[name as keyof SearchQuery]; 
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

export function getSearchHistoryDelete(): string {
    return "清除搜索历史"
}