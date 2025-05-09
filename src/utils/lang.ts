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
    star: "只显示关注选手",
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
    manage: "管理"
};
// current language is simplified chinese
export function getResultTableItemName(itemName: keyof SearchResultTableItem): string {
    return searchResultTableItemNameDictCn[itemName]
}

// current language is simplified chinese
export function getSearchBoxPlaceHolder(name: string): string {
    if (name == "leixing") {
        return "请输入项目阶段，留空代表不指定。例：决赛"
    } else if (name == "xingbie") {
        return "请输入性别，留空代表不指定。例：男"
    } else if (name == "zubie") {
        return "请输入组别，留空代表不指定。例：甲组"
    }
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

export function getSearchHistoryDelete(): string {
    return "清除搜索历史"
}