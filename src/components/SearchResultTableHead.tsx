// 组件：搜索结果的表头

import { getSearchResultDisplayOrder, SearchResultItem } from "../utils/types";
import { getResultItemName } from "../utils/lang";

export default function SearchResultTableHead() {
    const listname = getSearchResultDisplayOrder(); 
    const headContent = listname.map((name)=>(
        <th key={name}>
            {getResultItemName(name as keyof SearchResultItem)}
        </th>
    ))
    return (
        <tr>
            {headContent}
        </tr>
    );
}