// 组件：基本文本搜索框
import { SearchQuery } from "../utils/types";
import { getQueryItemName, getSearchBoxPlaceHolder } from "../utils/lang";  

interface SearchTextBoxProps {
    name: keyof SearchQuery; // 搜索框名称
    query: string; // 搜索框中内容
    textChange: (name: keyof SearchQuery, value: string) => void;
}

export default function SearchTextBox({ name, query, textChange}: SearchTextBoxProps) {
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "3px"}}>
            <div style={{width: "20%"}}>
                <p>{getQueryItemName(name)}: </p>
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => textChange(name, e.target.value)}
                placeholder={getSearchBoxPlaceHolder()}
                style={{width: "80%"}}
            />
        </div>
    );
}