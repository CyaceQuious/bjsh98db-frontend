// 组件：基本文本搜索框

import { SearchQuery } from "../utils/types";

interface SearchBooleanBoxProps {
    name: keyof SearchQuery; // 搜索框名称
    query: boolean; // 搜索框中内容
    booleanChange: (name: keyof SearchQuery, value: boolean) => void;
}

export default function SearchBooleanBox({ name, query, booleanChange }: SearchBooleanBoxProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", margin: "3px" }}>
            <div style={{ marginRight: 8 }}>
                <p>{name}:</p>
            </div>
            <input
                type="checkbox"
                checked={query}
                onChange={(e) => booleanChange(name, e.target.checked)}
                style={{
                    width: 16,
                    height: 16,
                    cursor: 'pointer'
                }}
            />
        </div>
    );
}