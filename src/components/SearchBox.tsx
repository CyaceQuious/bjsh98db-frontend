// 组件：完整搜索框
// 包含若干 SearchTextBox
// 

import { SearchQuery } from "../utils/types";
import SearchTextBox from "./SearchTextBox"
import SearchBooleanBox from "./SearchBooleanBox";
import { getSearchButtonText } from "../utils/lang";

interface SearchBoxProps {
    query: SearchQuery; // 搜索框中内容
    queryTextChange: (name: keyof SearchQuery, value: string) => void;
    queryBooleanChange: (name: keyof SearchQuery, value: boolean) => void; 
    doSearch: () => void; 
}

export default function SearchBox({ query, queryTextChange, queryBooleanChange, doSearch}: SearchBoxProps) {
    const listname: string[] = Object.keys(query);

    // decode all queries into Boxes
    const searchTextBoxes = [];
    const searchBooleanBoxes = []; 
    for (let i = 0; i<listname.length; i++) {
        const curValue: string | boolean | undefined = query[listname[i] as keyof SearchQuery]
        if (typeof curValue === "string") {
            searchTextBoxes.push((
                <div key={i}>
                <SearchTextBox 
                    name={listname[i] as keyof SearchQuery} 
                    query={curValue}
                    textChange={queryTextChange}
                />
                </div>
            ))
        } else if (typeof curValue === "boolean") {
            searchBooleanBoxes.push((
                <div key={i}>
                <SearchBooleanBox 
                    name={listname[i] as keyof SearchQuery} 
                    query={curValue}
                    booleanChange={queryBooleanChange}
                />
                </div>
            ))
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "80%"}}>
                <div style={{ display: "flex", flexDirection: "column"}}>
                    {searchTextBoxes}
                </div>
                <div style={{ display: "flex", flexDirection: "row"}}>
                    {searchBooleanBoxes}
                </div>
            </div>
            <button onClick={()=>doSearch()} style={{marginLeft: "10px", width: "60px", height: "30px", alignSelf: "center"}}>
                {getSearchButtonText()}
            </button>
        </div>
    );
}