// 组件：完整搜索框
// 包含若干 SearchTextBox
// 

import { SearchQuery } from "../utils/types";
import SearchTextBox from "./SeachTextBox"
import { useEffect, useRef, useState } from "react";

interface SearchBoxProps {
    query: SearchQuery; // 搜索框中内容
    queryChange: (name: string, value: string) => void;
    doSearch: () => void; 
}

export default function SearchBox({ query, queryChange, doSearch}: SearchBoxProps) {
    const listname: string[] = Object.keys(query);

    // decode all queries into Boxes
    const searchTextBoxes = [];
    for (let i = 0; i<listname.length; i++) {
        const curValue: string | boolean | undefined = query[listname[i] as keyof SearchQuery]
        if (typeof curValue === "string") {
            searchTextBoxes.push((
                <div key={i}>
                <SearchTextBox 
                    name={listname[i]} 
                    query={curValue}
                    textChange={queryChange}
                />
                </div>
            ))
        } else if (typeof curValue === "boolean") {
            // TODO
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "80%"}}>
                {searchTextBoxes}
            </div>
            <button onClick={()=>doSearch()} style={{marginLeft: "5%", width: "15%"}}>Search</button>
        </div>
    );
}