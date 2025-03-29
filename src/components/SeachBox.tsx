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
    const listname: string[] = Object.keys(query)
    const searchTextBoxes = listname.map((name)=>(
        <div key={name}>
        <SearchTextBox 
            name={name} 
            query={query[name as keyof SearchQuery]??""}
            textChange={queryChange}
        />
        </div>
    ))
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "80%"}}>
                {searchTextBoxes}
            </div>
            <button onClick={()=>doSearch()} style={{marginLeft: "5%", width: "15%"}}>Search</button>
        </div>
    );
}