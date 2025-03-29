// 组件：完整搜索框

import { useEffect, useRef, useState } from "react";
import SearchResultTableEntry from "./SeachResultTableEntry";
import SearchResultTableHead from "./SeachResultTableHead";
import { SearchResultItem } from "../utils/types";

interface SearchResultTableProps {
    results: SearchResultItem[]; // 所有搜索结果
}

export default function SearchResultTable({ results }: SearchResultTableProps) {
    const searchResultEntries = []
    for (let i = 0; i<results.length; i++) {
        searchResultEntries.push(
            <SearchResultTableEntry key={i+10} result={results[i]}/>
        )
    }
    return (
        <div>
            <table>
                <thead>
                    <SearchResultTableHead/>
                </thead>
                <tbody>
                    {searchResultEntries}
                </tbody>
            </table>
        </div>
    );
}