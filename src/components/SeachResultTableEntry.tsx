// 组件：搜索结果的一个条目

import { SearchResultItem } from "../utils/types";

interface SearchResultTableEntryProps {
    result: SearchResultItem; // 搜索结果条目内容
}

export default function SearchResultTableEntry({ result }: SearchResultTableEntryProps) {
    const listname: string[] = Object.keys(result)
    const entryContent = listname.map((name)=>(
        <td key={name}>
            {result[name as keyof SearchResultItem]}
        </td>
    ))
    return (
        <tr>
        {entryContent}
        </tr>
    );
}